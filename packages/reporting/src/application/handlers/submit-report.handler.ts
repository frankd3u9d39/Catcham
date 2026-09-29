import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubmitReportCommand } from '../commands/submit-report.command';

@CommandHandler(SubmitReportCommand)
export class SubmitReportHandler implements ICommandHandler<SubmitReportCommand> {
  async execute(command: SubmitReportCommand) {
    return { referenceNumber: 'CTM-2026-0001' };
  }
}
