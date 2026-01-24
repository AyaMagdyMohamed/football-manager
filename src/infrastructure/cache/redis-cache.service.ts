import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheService } from '../../modules/cache/interfaces/cache.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisCacheService implements CacheService {
  private client: Redis;

  constructor(private config: ConfigService) {
    this.client = new Redis({
      host: this.config.get('REDIS_HOST'),
      port: this.config.get<number>('REDIS_PORT'),
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds = 30): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
