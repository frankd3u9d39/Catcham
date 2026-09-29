import { Controller, Get } from '@nestjs/common';

@Controller('roles')
export class RolesController {
  @Get()
  async getRoles() {
    return { roles: [] };
  }
}
