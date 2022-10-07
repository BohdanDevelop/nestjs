import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    const { email, password } = dto;
    return await this.authService.signup(email, password);
  }
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    const { email, password } = dto;
    return this.authService.signin(email, password);
  }
  @Get('verify/:verificationToken')
  verify(@Req() req: Request) {
    const { verificationToken } = req.params;
    return this.authService.verifyToken(verificationToken);
  }
  @Post('/reverify')
  reverificate(@Body() email: { email: string }) {
    return this.authService.reverificate(email.email);
  }
}
