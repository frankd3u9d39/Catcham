import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GeoPointDto {
  @Type(() => Number)
  @IsNumber()
  lat!: number;

  @Type(() => Number)
  @IsNumber()
  lng!: number;
}
