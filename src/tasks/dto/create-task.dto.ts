import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTaskDTO {
 @IsString()
 @MinLength(2, { message: "Минимальная длина 2 символа"})
 title: string;
 @IsString()
 @IsOptional()
 description?: string;

 @IsBoolean()
 @IsOptional()
 completed?: boolean;

}