import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { RolesController } from './controllers/roles.controller';
import { LoginHandler } from './application/handlers/login.handler';
import { RegisterUserHandler } from './application/handlers/register-user.handler';
import { AuthDomainService } from './domain/services/auth.domain-service';

@Module({
  imports: [CqrsModule],
  controllers: [AuthController, UsersController, RolesController],
  providers: [LoginHandler, RegisterUserHandler, AuthDomainService],
  exports: [AuthDomainService],
})
export class IdentityModule {}
