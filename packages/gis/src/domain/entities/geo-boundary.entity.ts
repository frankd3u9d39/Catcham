export class GeoBoundaryEntity {
  id!: string;
  name!: string;
  type!: 'STATE' | 'LGA' | 'SPECIAL_COMMAND' | 'PIPELINE_CORRIDOR';
  boundaryGeoJson!: string;
}
