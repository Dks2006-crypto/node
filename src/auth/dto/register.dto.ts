import { IsEmail, IsInt, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsInt()
  groupId: number;

}