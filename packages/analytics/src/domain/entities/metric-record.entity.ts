export class MetricRecordEntity {
  id!: string;
  metricName!: string;
  agencyId?: string;
  value!: number;
  recordedAt!: Date;
}
