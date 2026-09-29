export class MembershipEntity {
  id!: string;
  userId!: string;
  agencyId!: string;
  departmentId?: string;
  officeId?: string;
  roleId!: string;
  isDelegated!: boolean;
  validUntil?: Date;
}
