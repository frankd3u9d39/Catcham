export class ReportEntity {
  id!: string;
  referenceNumber!: string;
  title!: string;
  description!: string;
  categoryId!: string;
  isAnonymous!: boolean;
  submitterId?: string;
  state?: string;
  lga?: string;
  latitude?: number;
  longitude?: number;
  assignedAgencyId?: string;
  currentStatus!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
