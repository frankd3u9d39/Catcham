import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface OverviewMetrics {
  reports: { total: number; last30Days: number; byStatus: Record<string, number> };
  investigations: { open: number; closed: number; byPriority: Record<string, number> };
  evidence: { total: number; archived: number; totalBytes: number };
  resolution: { medianDays: number | null; meanDays: number | null; closedSample: number };
}

export interface AgencyWorkload {
  agencyId: string;
  agencyName: string;
  acronym: string;
  openCases: number;
  closedCases: number;
  overdueCases: number;
  personnel: number;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async overview(): Promise<OverviewMetrics> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000);

    const [
      reportTotal,
      reportRecent,
      reportsByStatus,
      investigationsOpen,
      investigationsClosed,
      investigationsByPriority,
      evidenceAggregate,
      evidenceArchived,
      closedCases,
    ] = await Promise.all([
      this.prisma.report.count(),
      this.prisma.report.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.report.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.investigation.count({ where: { status: { not: 'CLOSED' } } }),
      this.prisma.investigation.count({ where: { status: 'CLOSED' } }),
      this.prisma.investigation.groupBy({ by: ['priority'], _count: { _all: true } }),
      this.prisma.evidence.aggregate({ _count: { _all: true }, _sum: { sizeBytes: true } }),
      this.prisma.evidence.count({ where: { isArchived: true } }),
      this.prisma.investigation.findMany({
        where: { status: 'CLOSED', closedAt: { not: null } },
        select: { createdAt: true, closedAt: true },
      }),
    ]);

    const durationsDays = closedCases
      .filter((row): row is { createdAt: Date; closedAt: Date } => row.closedAt !== null)
      .map((row) => (row.closedAt.getTime() - row.createdAt.getTime()) / 86_400_000)
      .sort((left, right) => left - right);

    return {
      reports: {
        total: reportTotal,
        last30Days: reportRecent,
        byStatus: tally(reportsByStatus, 'status'),
      },
      investigations: {
        open: investigationsOpen,
        closed: investigationsClosed,
        byPriority: tally(investigationsByPriority, 'priority'),
      },
      evidence: {
        total: evidenceAggregate._count._all,
        archived: evidenceArchived,
        totalBytes: evidenceAggregate._sum.sizeBytes ?? 0,
      },
      resolution: {
        medianDays: median(durationsDays),
        meanDays: mean(durationsDays),
        closedSample: durationsDays.length,
      },
    };
  }

  async agencyWorkload(): Promise<AgencyWorkload[]> {
    const now = new Date();

    const agencies = await this.prisma.agency.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { memberships: true } },
        investigations: { select: { status: true, dueAt: true } },
      },
    });

    return agencies.map((agency) => {
      const open = agency.investigations.filter((row) => row.status !== 'CLOSED');

      return {
        agencyId: agency.id,
        agencyName: agency.name,
        acronym: agency.acronym,
        openCases: open.length,
        closedCases: agency.investigations.length - open.length,
        overdueCases: open.filter((row) => row.dueAt !== null && row.dueAt < now).length,
        personnel: agency._count.memberships,
      };
    });
  }

  /**
   * Report volume per day over a window, with missing days filled in so a chart
   * does not compress gaps.
   */
  async reportVolume(days = 30): Promise<Array<{ date: string; count: number }>> {
    const since = new Date(Date.now() - days * 86_400_000);
    since.setUTCHours(0, 0, 0, 0);

    const reports = await this.prisma.report.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    });

    const counts = new Map<string, number>();
    for (let offset = 0; offset <= days; offset += 1) {
      const date = new Date(since.getTime() + offset * 86_400_000);
      counts.set(date.toISOString().slice(0, 10), 0);
    }

    for (const report of reports) {
      const key = report.createdAt.toISOString().slice(0, 10);
      if (counts.has(key)) {
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }

    return [...counts.entries()].map(([date, count]) => ({ date, count }));
  }

  async categoryBreakdown() {
    const grouped = await this.prisma.report.groupBy({
      by: ['categoryId'],
      _count: { _all: true },
    });

    const categories = await this.prisma.reportCategory.findMany({
      where: { id: { in: grouped.map((row) => row.categoryId) } },
      select: { id: true, code: true, name: true },
    });
    const byId = new Map(categories.map((category) => [category.id, category]));

    return grouped
      .map((row) => ({
        categoryId: row.categoryId,
        code: byId.get(row.categoryId)?.code ?? 'UNKNOWN',
        name: byId.get(row.categoryId)?.name ?? 'Unknown',
        count: row._count._all,
      }))
      .sort((left, right) => right.count - left.count);
  }

  /** Open cases past their due date, which is the SLA breach list. */
  async overdueCases(agencyIds: readonly string[]) {
    const cases = await this.prisma.investigation.findMany({
      where: {
        agencyId: { in: [...agencyIds] },
        status: { not: 'CLOSED' },
        dueAt: { lt: new Date() },
      },
      orderBy: { dueAt: 'asc' },
      include: {
        agency: { select: { acronym: true } },
        report: { select: { title: true } },
      },
    });

    return cases.map((row) => ({
      id: row.id,
      caseNumber: row.caseNumber,
      title: row.report.title,
      agency: row.agency.acronym,
      priority: row.priority,
      status: row.status,
      dueAt: row.dueAt,
      daysOverdue: row.dueAt
        ? Math.floor((Date.now() - row.dueAt.getTime()) / 86_400_000)
        : 0,
    }));
  }
}

function tally<K extends string>(
  rows: Array<Record<K, string> & { _count: { _all: number } }>,
  key: K,
): Record<string, number> {
  return Object.fromEntries(rows.map((row) => [row[key], row._count._all]));
}

function median(sorted: readonly number[]): number | null {
  if (sorted.length === 0) {
    return null;
  }

  const middle = Math.floor(sorted.length / 2);
  const value =
    sorted.length % 2 === 0 ? (sorted[middle - 1]! + sorted[middle]!) / 2 : sorted[middle]!;

  return Math.round(value * 10) / 10;
}

function mean(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round((total / values.length) * 10) / 10;
}
