import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAgencyDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  code!: string;
}
