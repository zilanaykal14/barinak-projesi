
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAsiDto {
  @IsString()
  @IsNotEmpty()
  ad: string; 

  @IsString()
  @IsOptional()
  tur?: string; 
}