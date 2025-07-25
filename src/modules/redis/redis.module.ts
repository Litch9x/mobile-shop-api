// src/redis/redis.module.ts
import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    return new Redis({
      host: 'redis-17338.c57.us-east-1-4.ec2.redns.redis-cloud.com',
      port: 17338,
      username: 'default', // nếu có username
      password: 'BXZWBFcdDyQxF25zKi3MrhW7zSIea1fn', // nếu có mật khẩu
      db: 0,
      connectTimeout: 100000,
    });
  },
};

@Global() // Đánh dấu là module toàn cục (dùng được ở mọi nơi)
@Module({
  imports: [],
  providers: [redisProvider, RedisService],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule { }
