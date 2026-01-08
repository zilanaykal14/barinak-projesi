import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum } from 'class-validator';

import { UserRole } from '../entities/user.entity'; 

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;


  @IsEnum(UserRole) 
  @IsOptional()
  role?: UserRole; 
}