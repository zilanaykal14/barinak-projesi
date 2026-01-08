import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateHayvanDto {
  @IsString()
  @IsNotEmpty()
  ad: string;

  @IsString()
  @IsNotEmpty()
  tur: string;

  @IsNumber()
  yas: number;

  @IsString()
  @IsOptional()
  aciklama?: string;
}