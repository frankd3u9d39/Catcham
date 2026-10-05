import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PageQueryDto } from '../../../common/pagination';

export class UserQueryDto extends PageQueryDto {
  @ApiPropertyOptional({ description: 'Matches the email or full name' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;
}
