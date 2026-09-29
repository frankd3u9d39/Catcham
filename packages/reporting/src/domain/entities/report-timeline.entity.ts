export class ReportTimelineEntity {
  id!: string;
  reportId!: string;
  action!: string;
  description!: string;
  actorType!: 'CITIZEN' | 'OFFICER' | 'SYSTEM';
  actorId?: string;
  createdAt!: Date;
}
