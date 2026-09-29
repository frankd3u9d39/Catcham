import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/login.command';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  async execute(command: LoginCommand) {
    return { accessToken: 'jwt', userId: 'user-id' };
  }
}
