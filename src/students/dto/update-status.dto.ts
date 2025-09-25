import { IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateStudentStatusDto {
  @IsEnum(Status)
  status: Status;
}
