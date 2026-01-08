import { IsString, IsNotEmpty } from 'class-validator';

export class CreateIrkDto {
  @IsString()
  @IsNotEmpty()
  ad: string; 

  @IsString()
  @IsNotEmpty()
  tur: string; 
}