import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PageQueryDto } from '../../../common/pagination';

export class NotificationQueryDto extends PageQueryDto {
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  // Query strings carry "true"/"false" as text; implicit conversion is off, so
  // the coercion is explicit here.
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  unreadOnly = false;
}
