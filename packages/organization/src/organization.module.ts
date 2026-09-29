import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AgenciesController } from './controllers/agencies.controller';
import { DepartmentsController } from './controllers/departments.controller';
import { OfficesController } from './controllers/offices.controller';
import { JurisdictionsController } from './controllers/jurisdictions.controller';
import { MembershipsController } from './controllers/memberships.controller';
import { HierarchyAccessService } from './domain/services/hierarchy-access.service';

@Module({
  imports: [CqrsModule],
  controllers: [
    AgenciesController,
    DepartmentsController,
    OfficesController,
    JurisdictionsController,
    MembershipsController,
  ],
  providers: [HierarchyAccessService],
  exports: [HierarchyAccessService],
})
export class OrganizationModule {}
