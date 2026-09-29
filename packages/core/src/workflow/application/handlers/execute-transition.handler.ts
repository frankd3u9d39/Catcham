import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExecuteTransitionCommand } from '../commands/execute-transition.command';

@CommandHandler(ExecuteTransitionCommand)
export class ExecuteTransitionHandler implements ICommandHandler<ExecuteTransitionCommand> {
  async execute(command: ExecuteTransitionCommand) {
    return { success: true, instanceId: command.instanceId };
  }
}
