
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsString, MinLength } from 'class-validator';

class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('authenticate')
  authenticate(@Body() dto: AuthDto) {
    return this.service.authenticate(dto.email, dto.password);
  }
}
