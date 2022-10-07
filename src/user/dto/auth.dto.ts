import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
export class SettingDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
