export class AgencyEntity {
  id!: string;
  code!: string;
  name!: string;
  category!: 'LAW_ENFORCEMENT' | 'REGULATORY' | 'EMERGENCY' | 'ENERGY' | 'CIVIL';
  acronym!: string;
  jurisdictionScope!: 'NATIONAL' | 'STATE' | 'ZONAL';
  isActive!: boolean;
  createdAt!: Date;
}
