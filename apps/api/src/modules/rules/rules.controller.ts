import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RulesService } from './rules.service';
import {
  CreateRuleDto,
  RULE_ACTIONS,
  RULE_CATEGORIES,
  SimulateRuleDto,
  UpdateRuleDto,
  type RuleCategory,
} from './dto/rule.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { PERMISSIONS } from '../../common/constants';

@ApiBearerAuth()
@ApiTags('Business rules')
@Controller('rules')
export class RulesController {
  constructor(private readonly rules: RulesService) {}

  @Get('metadata')
  @RequirePermissions(PERMISSIONS.RULE_MANAGE)
  @ApiOperation({ summary: 'Categories and actions available to the rule builder' })
  metadata() {
    return { categories: RULE_CATEGORIES, actions: RULE_ACTIONS };
  }

  @Get()
  @RequirePermissions(PERMISSIONS.RULE_MANAGE)
  list(@Query('category') category?: RuleCategory) {
    return this.rules.list(category);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.RULE_MANAGE)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rules.findById(id);
  }

  @Post()
  @RequirePermissions(PERMISSIONS.RULE_MANAGE)
  create(@Body() dto: CreateRuleDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.rules.create(dto, actor);
  }

  @Post('simulate')
  @RequirePermissions(PERMISSIONS.RULE_MANAGE)
  @ApiOperation({ summary: 'Evaluate the enabled rules in a category against supplied facts' })
  simulate(@Body() dto: SimulateRuleDto) {
    return this.rules.simulate(dto.category, dto.facts);
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.RULE_MANAGE)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRuleDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.rules.update(id, dto, actor);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(PERMISSIONS.RULE_MANAGE)
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.rules.remove(id, actor);
  }
}
