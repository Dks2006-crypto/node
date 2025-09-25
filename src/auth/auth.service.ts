import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// Определяем сервис для обработки аутентификации
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  // Регистрация нового пользователя
  async register(dto: RegisterDto) {
    // Создаем пользователя в базе данных
    const existingStudent = await this.prisma.student.findUnique({
      where: { email: dto.email }
    });
    if (existingStudent) {
      throw new ConflictException('Студент с таким email уже зарегистрирован');
    }

    const nextStudentId = await this.getNextStudentId();

    const student = await this.prisma.student.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        studentId: nextStudentId,
        groupId: dto.groupId,
        status: 'STUDYING',
        role: 'USER',
      },
    });

    // Генерируем токены для пользователя
    return this.generateTokens(student.id, student.email, student.role);
  }

  // Вход пользователя
  async login(dto: LoginDto) {
    // Ищем пользователя по email
    const student = await this.prisma.student.findUnique({ where: { email: dto.email } });
    // Проверяем наличие пользователя и корректность пароля
    if (!student) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Генерируем токены для пользователя
    return this.generateTokens(student.id, student.email, student.role);
  }

  // Обновление токенов
  async refresh(refreshToken: string) {
    try {
      // Проверяем валидность refresh-токена
      const payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET
      });
      // Ищем пользователя по ID из токена
      const student = await this.prisma.student.findUnique({
        where: { id: payload.sub }
      });
      if (!student) throw new UnauthorizedException();
      // Генерируем новые токены
      return this.generateTokens(student.id, student.email, student.role);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Генерация access и refresh токенов
  private generateTokens(studentId: number, email: string, role: string) {
    // Создаем access-токен с временем жизни 15 минут
    const accessToken = this.jwt.sign({ sub: studentId, email, role }, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
    // Создаем refresh-токен с временем жизни 7 дней
    const refreshToken = this.jwt.sign({ sub: studentId }, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
    return { accessToken, refreshToken };
  }

  private async getNextStudentId(): Promise<number> {
    const lastStudent = await this.prisma.student.findFirst({
      orderBy: { studentId: 'desc' },
    });
    return lastStudent ? lastStudent.studentId + 1 : 1000;
  }
}