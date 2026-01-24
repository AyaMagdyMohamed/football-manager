
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { BackgroundJobsModule } from '../background-jobs/background-jobs.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '1d' }}),
    BackgroundJobsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
