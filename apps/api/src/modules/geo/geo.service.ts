import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type { JurisdictionLevel } from '../../common/constants';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface JurisdictionMatch {
  code: string;
  name: string;
  level: JurisdictionLevel;
  parentCode: string | null;
  /** Kilometres from the point to the jurisdiction centroid. */
  distanceKm: number;
}

const EARTH_RADIUS_KM = 6371;

/**
 * Jurisdiction resolution without a spatial extension.
 *
 * Each jurisdiction stores a bounding box and a centroid. Resolution filters by
 * bounding box in SQL, then picks the closest centroid among the candidates.
 * Bounding boxes overlap at borders, so the centroid distance is what makes the
 * result deterministic. This is approximate by design — it is accurate enough to
 * route a report to a state or LGA, and the triage officer can override it.
 */
@Injectable()
export class GeoService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(point: GeoPoint): Promise<{ state?: JurisdictionMatch; lga?: JurisdictionMatch }> {
    const candidates = await this.prisma.jurisdiction.findMany({
      where: {
        minLat: { lte: point.latitude },
        maxLat: { gte: point.latitude },
        minLng: { lte: point.longitude },
        maxLng: { gte: point.longitude },
      },
    });

    const matches = candidates
      .map((row) => ({
        code: row.code,
        name: row.name,
        level: row.level as JurisdictionLevel,
        parentCode: row.parentCode,
        distanceKm: haversineKm(point, { latitude: row.centroidLat, longitude: row.centroidLng }),
      }))
      .sort((left, right) => left.distanceKm - right.distanceKm);

    return {
      state: matches.find((match) => match.level === 'STATE'),
      lga: matches.find((match) => match.level === 'LGA'),
    };
  }

  listJurisdictions(level?: JurisdictionLevel, parentCode?: string) {
    return this.prisma.jurisdiction.findMany({
      where: { level, parentCode },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Offices within `radiusKm` of a point, nearest first. The bounding-box
   * prefilter keeps the row scan proportional to the search area rather than the
   * whole table; the haversine pass then trims the box corners.
   */
  async nearestOffices(point: GeoPoint, radiusKm = 50, limit = 10) {
    const latitudeDelta = radiusKm / 111;
    const longitudeDelta = radiusKm / (111 * Math.cos(toRadians(point.latitude)) || 1);

    const offices = await this.prisma.office.findMany({
      where: {
        latitude: { gte: point.latitude - latitudeDelta, lte: point.latitude + latitudeDelta },
        longitude: { gte: point.longitude - longitudeDelta, lte: point.longitude + longitudeDelta },
      },
      include: { department: { include: { agency: true } } },
    });

    return offices
      .flatMap((office) => {
        if (office.latitude === null || office.longitude === null) {
          return [];
        }
        const distanceKm = haversineKm(point, {
          latitude: office.latitude,
          longitude: office.longitude,
        });
        return distanceKm <= radiusKm
          ? [
              {
                id: office.id,
                name: office.name,
                agencyName: office.department.agency.name,
                agencyAcronym: office.department.agency.acronym,
                stateCode: office.stateCode,
                address: office.address,
                distanceKm: Math.round(distanceKm * 10) / 10,
              },
            ]
          : [];
      })
      .sort((left, right) => left.distanceKm - right.distanceKm)
      .slice(0, limit);
  }
}

export function haversineKm(from: GeoPoint, to: GeoPoint): number {
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLng = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(deltaLng / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
