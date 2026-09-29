export class CreateInvestigationCommand {
  constructor(
    public readonly reportId: string,
    public readonly agencyId: string,
    public readonly assignedSupervisorId: string,
    public readonly priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
  ) {}
}
