import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? [
              { emit: 'event', level: 'query' },
              { emit: 'stdout', level: 'info' },
              { emit: 'stdout', level: 'warn' },
              { emit: 'stdout', level: 'error' },
            ]
          : [{ emit: 'stdout', level: 'error' }],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma client connected successfully to Neon PostgreSQL database.');
    } catch (err) {
      this.logger.error('Failed to connect to PostgreSQL via Prisma:', err);
      throw err;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma client disconnected gracefully.');
  }
}
