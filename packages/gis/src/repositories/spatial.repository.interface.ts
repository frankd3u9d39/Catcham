export interface ISpatialRepository {
  findContainingJurisdiction(lat: number, lng: number): Promise<string | null>;
}
