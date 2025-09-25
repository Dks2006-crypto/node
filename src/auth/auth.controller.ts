import { Body, Controller, Post, Res, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import  type { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const tokens = await this.authService.register(dto);
    this.setCookies(res, tokens);
    return res.json({ message: 'Registered' });
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(dto);
    this.setCookies(res, tokens);
    return res.json({ message: 'Logged in' });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    // Извлекаем refresh-токен из cookies
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException();
    // Вызываем сервис для обновления токенов
    const tokens = await this.authService.refresh(refreshToken);
    // Устанавливаем новые токены в cookies
    this.setCookies(res, tokens);
    // Возвращаем сообщение об успешном обновлении
    return res.json({ message: 'Tokens refreshed' });
  }


  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout (@Res() res: Response ) {

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.json({ message: 'Logged out' });
  }

  private setCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: false, sameSite: 'lax' });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: false, sameSite: 'lax' });
  }
}