import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, GrantMembershipDto, UpdateUserDto } from './dto/auth.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { PERMISSIONS } from '../../common/constants';


@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.USER_READ)
  @ApiOperation({ summary: 'List personnel accounts' })
  list(@Query() query: UserQueryDto) {
    return this.users.list(query, query.search);
  }

  @Get('roles')
  @RequirePermissions(PERMISSIONS.USER_READ)
  @ApiOperation({ summary: 'List roles with their permission sets' })
  listRoles() {
    return this.users.listRoles();
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.USER_READ)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.users.findById(id);
  }

  @Post()
  @RequirePermissions(PERMISSIONS.USER_MANAGE)
  @ApiOperation({ summary: 'Create a personnel account' })
  create(@Body() dto: CreateUserDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.users.create(dto, actor);
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.USER_MANAGE)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.users.update(id, dto, actor);
  }

  @Post(':id/memberships')
  @RequirePermissions(PERMISSIONS.USER_MANAGE)
  @ApiOperation({ summary: 'Grant an agency role to a user' })
  grantMembership(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: GrantMembershipDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.users.grantMembership(id, dto, actor);
  }

  @Delete(':id/memberships/:membershipId')
  @RequirePermissions(PERMISSIONS.USER_MANAGE)
  revokeMembership(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.users.revokeMembership(id, membershipId, actor);
  }
}
