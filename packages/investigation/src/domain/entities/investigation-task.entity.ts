export class InvestigationTaskEntity {
  id!: string;
  investigationId!: string;
  assignedToId!: string;
  title!: string;
  description!: string;
  dueDate?: Date;
  status!: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  createdAt!: Date;
}
