import { ReportEntity } from '../domain/entities/report.entity';

export interface IReportRepository {
  findById(id: string): Promise<ReportEntity | null>;
  findByRef(ref: string): Promise<ReportEntity | null>;
  save(report: ReportEntity): Promise<void>;
}
