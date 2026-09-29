export interface IAnalyticsRepository {
  fetchAggregatedMetrics(): Promise<any>;
}
