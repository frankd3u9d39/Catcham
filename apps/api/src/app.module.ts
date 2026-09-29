import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Reusable Infrastructure & Core
import { CoreModule } from '@catcham/core';

// Business Modules from packages/
import { IdentityModule } from '@catcham/identity';
import { OrganizationModule } from '@catcham/organization';
import { ReportingModule } from '@catcham/reporting';
import { InvestigationModule } from '@catcham/investigation';
import { EvidenceModule } from '@catcham/evidence';
import { NotificationModule } from '@catcham/notification';
import { AuditModule } from '@catcham/audit';
import { AnalyticsModule } from '@catcham/analytics';
import { SearchModule } from '@catcham/search';
import { GisModule } from '@catcham/gis';

// Local API Modules
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    HealthModule,

    // Modular Monolith Domain Modules
    CoreModule,
    IdentityModule,
    OrganizationModule,
    ReportingModule,
    InvestigationModule,
    EvidenceModule,
    NotificationModule,
    AuditModule,
    AnalyticsModule,
    SearchModule,
    GisModule,
  ],
})
export class AppModule {}
