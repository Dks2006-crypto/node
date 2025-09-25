import { IsEmail, IsEnum, IsInt, IsString } from 'class-validator';
import { Role, Status } from '@prisma/client';

export class CreateStudentDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsInt()
  groupId: number;

  @IsEnum(Status)
  status?: 'STUDYING' | 'ACADEMIC_LEAVE' | 'EXPELLED' | 'NOT_STUDYING';

  @IsEnum(Role)
  role?: 'USER' | 'ADMIN';
}
