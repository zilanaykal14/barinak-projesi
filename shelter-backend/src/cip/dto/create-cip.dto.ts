import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCipDto {
  @IsString()
  @IsNotEmpty()
  numara: string; 


  @IsNumber()
  @IsOptional()
  hayvanId?: number;
}