// src/bildirim/dto/create-bildirim.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateBildirimDto {
  
  
  @IsString()
  @IsNotEmpty()
  tip: string;

  @IsString()
  @IsNotEmpty()
  mesaj: string;

  @IsString()
  @IsOptional()
  gonderenAd?: string;

  @IsNumber()
  @IsOptional()
  hayvanId?: number;
}