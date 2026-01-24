
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import  { AuthDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

   @ApiResponse({
    status: 200,
    description: 'Signup/Login successful'
  })
  @Post('authenticate')
  authenticate(@Body() dto: AuthDto) {
    return this.service.authenticate(dto.email, dto.password);
  }
}
