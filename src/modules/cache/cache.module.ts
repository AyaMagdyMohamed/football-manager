
import { Module } from '@nestjs/common';
import { RedisCacheService } from '../../infrastructure/cache/redis-cache.service';

@Module({
  providers: [{ provide: 'CacheService', useClass: RedisCacheService }],
  exports: ['CacheService']
})
export class CacheModule {}
