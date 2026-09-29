import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateInvestigationCommand } from '../commands/create-investigation.command';

@CommandHandler(CreateInvestigationCommand)
export class CreateInvestigationHandler implements ICommandHandler<CreateInvestigationCommand> {
  async execute(command: CreateInvestigationCommand) {
    return { caseId: 'case-uuid', caseNumber: 'CAS-2026-0001' };
  }
}
