export class SubmitReportCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly categoryId: string,
    public readonly latitude?: number,
    public readonly longitude?: number,
    public readonly submitterId?: string,
  ) {}
}
