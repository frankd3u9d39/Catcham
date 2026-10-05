import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../database/prisma.service';

/**
 * Exercises the citizen-facing path against a real database: submit, route,
 * track. It boots the whole application, so it needs the reference data seed
 * (categories, routing rules, jurisdictions) applied to DATABASE_URL first.
 *
 * Rate limiting is left on rather than stubbed out, because it is part of what
 * protects the anonymous submission endpoint. That caps the suite at five
 * submissions, so the tests share them deliberately and the last one asserts
 * that the sixth is refused.
 */
describe('Public reporting (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let categoryId: string;

  /** Submissions made by this suite, removed in afterAll. */
  const createdReferences: string[] = [];

  /** The shared anonymous submission, reused by the tracking tests. */
  let anonymous: { referenceNumber: string; trackingCode: string; routedTo: string | null };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleRef.createNestApplication();

    // Mirrors main.ts. The exception filter and the response interceptor come
    // from AppModule's APP_FILTER and APP_INTERCEPTOR providers, so registering
    // them again here would wrap every response body twice.
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );

    await app.init();

    prisma = app.get(PrismaService);

    const category = await prisma.reportCategory.findFirst({ where: { code: 'OIL_PIPELINE' } });
    if (!category) {
      throw new Error('Reference data is missing. Run `pnpm db:seed` before this suite.');
    }
    categoryId = category.id;
  }, 60_000);

  afterAll(async () => {
    // Remove only what this suite created, so it can run against a database
    // that already holds data.
    const references = createdReferences.filter(Boolean);
    if (references.length > 0) {
      await prisma.report.deleteMany({ where: { referenceNumber: { in: references } } });
    }
    await app?.close();
  });

  const server = () => request(app.getHttpServer());

  const validReport = () => ({
    title: 'Night-time loading at an unmarked flowline tap',
    description:
      'Tankers have been loading from an exposed flowline tap each night this week between 02:00 and 04:00, with no markings or documentation on the vehicles.',
    categoryId,
    isAnonymous: true,
  });

  it('lists the active report categories without authentication', async () => {
    const response = await server().get('/api/v1/public/reports/categories').expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0]).toHaveProperty('code');
  });

  // Submissions 1 to 3 of the five the rate limit allows.
  describe('rejected submissions', () => {
    it('rejects a description too short to triage', async () => {
      const response = await server()
        .post('/api/v1/public/reports')
        .send({ ...validReport(), description: 'Too short.' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.details).toEqual(
        expect.arrayContaining([expect.stringContaining('description')]),
      );
    });

    it('rejects a category that does not exist', async () => {
      await server()
        .post('/api/v1/public/reports')
        .send({ ...validReport(), categoryId: '11111111-1111-4111-8111-111111111111' })
        .expect(400);
    });

    it('rejects a non-anonymous report with no way to make contact', async () => {
      await server()
        .post('/api/v1/public/reports')
        .send({ ...validReport(), isAnonymous: false })
        .expect(400);
    });
  });

  // Submission 4.
  describe('an accepted anonymous submission', () => {
    beforeAll(async () => {
      const response = await server()
        .post('/api/v1/public/reports')
        .send(validReport())
        .expect(201);

      anonymous = response.body.data;
      createdReferences.push(anonymous.referenceNumber);
    });

    it('returns a reference number and a one-time tracking code', () => {
      expect(anonymous.referenceNumber).toMatch(/^CTM-\d{4}-[0-9A-F]{6}$/);
      expect(anonymous.trackingCode).toHaveLength(10);
      expect(anonymous.routedTo).toBeTruthy();
    });

    it('stores a hash of the tracking code rather than the code', async () => {
      const stored = await prisma.report.findUnique({
        where: { referenceNumber: anonymous.referenceNumber },
      });

      expect(stored?.trackingCodeHash).toBeTruthy();
      expect(stored?.trackingCodeHash).not.toContain(anonymous.trackingCode);
    });

    it('stores no contact details', async () => {
      const stored = await prisma.report.findUnique({
        where: { referenceNumber: anonymous.referenceNumber },
      });

      expect(stored?.isAnonymous).toBe(true);
      expect(stored?.contactEmail).toBeNull();
      expect(stored?.contactPhone).toBeNull();
      expect(stored?.submitterId).toBeNull();
    });

    it('records the routing decision on the timeline', async () => {
      const stored = await prisma.report.findUnique({
        where: { referenceNumber: anonymous.referenceNumber },
        include: { timeline: { orderBy: { createdAt: 'asc' } } },
      });

      expect(stored?.timeline.map((entry) => entry.action)).toEqual(
        expect.arrayContaining(['SUBMITTED', 'ROUTED']),
      );
    });
  });

  // Submission 5.
  it('routes a Rivers State pipeline report to the spill agency, not the national default', async () => {
    const response = await server()
      .post('/api/v1/public/reports')
      // Inside Rivers State, where a jurisdiction-scoped routing rule outranks
      // the national one for this category.
      .send({ ...validReport(), latitude: 4.79, longitude: 7.12 })
      .expect(201);

    createdReferences.push(response.body.data.referenceNumber);
    expect(response.body.data.routedTo).toContain('Oil Spill');

    const stored = await prisma.report.findUnique({
      where: { referenceNumber: response.body.data.referenceNumber },
    });

    // Resolved from the coordinates rather than taken from the request.
    expect(stored?.stateCode).toBe('RI');
    // A seeded business rule raises pipeline reports to critical.
    expect(stored?.priority).toBe('CRITICAL');
  });

  // The sixth submission in the window.
  it('rate limits anonymous submission once the window allowance is spent', async () => {
    const response = await server().post('/api/v1/public/reports').send(validReport());

    expect(response.status).toBe(429);
  });

  describe('tracking', () => {
    it('returns the report for the correct reference and code', async () => {
      const response = await server()
        .post('/api/v1/public/reports/track')
        .send({
          referenceNumber: anonymous.referenceNumber,
          trackingCode: anonymous.trackingCode,
        })
        .expect(201);

      expect(response.body.data.referenceNumber).toBe(anonymous.referenceNumber);
      expect(response.body.data.timeline.length).toBeGreaterThan(0);
    });

    it('accepts the reference and code in any case', async () => {
      await server()
        .post('/api/v1/public/reports/track')
        .send({
          referenceNumber: anonymous.referenceNumber.toLowerCase(),
          trackingCode: anonymous.trackingCode.toLowerCase(),
        })
        .expect(201);
    });

    it('refuses a correct reference with the wrong code', async () => {
      await server()
        .post('/api/v1/public/reports/track')
        .send({ referenceNumber: anonymous.referenceNumber, trackingCode: 'WRONGCODE1' })
        .expect(404);
    });

    it('refuses a reference that does not exist', async () => {
      await server()
        .post('/api/v1/public/reports/track')
        .send({
          referenceNumber: 'CTM-2026-000000',
          trackingCode: anonymous.trackingCode,
        })
        .expect(404);
    });

    it('does not disclose contact details or investigation state', async () => {
      const response = await server()
        .post('/api/v1/public/reports/track')
        .send({
          referenceNumber: anonymous.referenceNumber,
          trackingCode: anonymous.trackingCode,
        })
        .expect(201);

      const body = JSON.stringify(response.body);
      expect(body).not.toContain('contactEmail');
      expect(body).not.toContain('investigations');
      expect(body).not.toContain('trackingCodeHash');
    });
  });

  describe('authentication', () => {
    it('refuses the officer report queue without a token', async () => {
      const response = await server().get('/api/v1/reports').expect(401);

      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('refuses a malformed token', async () => {
      await server()
        .get('/api/v1/reports')
        .set('Authorization', 'Bearer not-a-real-token')
        .expect(401);
    });
  });

  describe('geography', () => {
    it('resolves a coordinate pair to its state and LGA', async () => {
      const response = await server()
        .get('/api/v1/geo/resolve')
        .query({ latitude: 6.44, longitude: 3.52 })
        .expect(200);

      expect(response.body.data.state.code).toBe('LA');
      expect(response.body.data.lga).toBeTruthy();
    });

    it('rejects an out-of-range coordinate', async () => {
      await server()
        .get('/api/v1/geo/resolve')
        .query({ latitude: 999, longitude: 3.52 })
        .expect(400);
    });
  });
});
