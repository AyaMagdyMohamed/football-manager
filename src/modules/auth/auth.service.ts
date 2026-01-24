
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Queue } from 'bullmq';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
    private jwt: JwtService,
    @Inject('TEAM_QUEUE') private readonly teamQueue: Queue,
  ) {}

  async authenticate(email: string, password: string) {
    const existingUser = await this.repo.findOne({ where: { email } });

    if (existingUser) {
      const valid = await bcrypt.compare(password, existingUser.password);
      if (!valid) throw new UnauthorizedException('Invalid email or password');

      const token = this.jwt.sign({ sub: existingUser.id });
      return { token, isNewUser: false };
    }

    const hash = await bcrypt.hash(password, 10);
    const user = this.repo.create({ email, password: hash });
    await this.repo.save(user);
    // enqueue team creation job
    await this.teamQueue.add('create-team', {
      userId: user.id,
    });
    const token = this.jwt.sign({ sub: user.id });
    return { token, isNewUser: true };
  }
}
