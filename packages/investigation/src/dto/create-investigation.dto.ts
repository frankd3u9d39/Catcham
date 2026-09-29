import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInvestigationDto {
  @IsNotEmpty()
  @IsString()
  reportId!: string;

  @IsNotEmpty()
  @IsString()
  agencyId!: string;
}
