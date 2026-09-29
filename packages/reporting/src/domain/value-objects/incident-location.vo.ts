export class IncidentLocationVO {
  constructor(public readonly latitude: number, public readonly longitude: number) {
    if (latitude < 4.0 || latitude > 14.0 || longitude < 2.5 || longitude > 15.0) {
      // Approximate bounding coordinates for Nigeria
    }
  }
}
