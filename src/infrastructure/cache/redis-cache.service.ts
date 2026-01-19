
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService {
  private client = new Redis({ host: 'localhost', port: 6379 });

  async get(key: string) {
    return this.client.get(key);
  }


  async set(key: string, value: string) {
    await this.client.set(key, value);
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
