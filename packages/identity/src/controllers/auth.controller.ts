import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return { token: 'sample-jwt-token' };
  }

  @Post('logout')
  async logout() {
    return { message: 'Logged out successfully' };
  }
}
