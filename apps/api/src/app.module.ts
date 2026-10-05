import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { loadConfiguration } from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuditModule } from './modules/audit/audit.module';
import { NotificationModule } from './modules/notification/notification.module';
import { IdentityModule } from './modules/identity/identity.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { GeoModule } from './modules/geo/geo.module';
import { RulesModule } from './modules/rules/rules.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { ReportingModule } from './modules/reporting/reporting.module';
import { InvestigationModule } from './modules/investigation/investigation.module';
import { EvidenceModule } from './modules/evidence/evidence.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthGuard } from './common/guards/auth.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      // loadConfiguration validates and coerces the whole environment at boot,
      // so a bad value stops the process instead of surfacing later as a
      // confusing runtime failure.
      load: [loadConfiguration],
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.getOrThrow<number>('RATE_LIMIT_WINDOW_MS'),
          limit: config.getOrThrow<number>('RATE_LIMIT_MAX'),
        },
      ],
    }),

    DatabaseModule,
    AuditModule,
    NotificationModule,
    HealthModule,

    IdentityModule,
    OrganizationModule,
    GeoModule,
    RulesModule,
    WorkflowModule,
    ReportingModule,
    InvestigationModule,
    EvidenceModule,
    AnalyticsModule,
  ],
  providers: [
    // Order matters: throttling first, then authentication, then authorisation.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
