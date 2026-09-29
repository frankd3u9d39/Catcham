import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterEvidenceCommand } from '../commands/register-evidence.command';

@CommandHandler(RegisterEvidenceCommand)
export class RegisterEvidenceHandler implements ICommandHandler<RegisterEvidenceCommand> {
  async execute(command: RegisterEvidenceCommand) {
    return { evidenceId: 'evi-uuid', checksum: command.sha256Checksum };
  }
}
