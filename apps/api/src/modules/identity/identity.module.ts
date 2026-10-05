import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Module({
  imports: [
    // Registered with no options because access and refresh tokens use different
    // secrets, which are passed per sign and verify call.
    JwtModule.register({}),
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, UsersService],
  // JwtModule is re-exported so the global AuthGuard, which lives in AppModule's
  // injection context, can resolve JwtService.
  exports: [JwtModule, AuthService, UsersService],
})
export class IdentityModule {}
