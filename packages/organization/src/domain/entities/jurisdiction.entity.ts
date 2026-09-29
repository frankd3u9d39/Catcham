export class JurisdictionEntity {
  id!: string;
  name!: string;
  level!: 'FEDERAL' | 'STATE' | 'LGA' | 'SECTORAL';
  stateCode?: string;
  lgaCode?: string;
  polygonGeoJson?: string;
}
