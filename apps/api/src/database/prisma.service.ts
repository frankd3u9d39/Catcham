import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();

    // The default rollback journal blocks readers for the duration of a write,
    // which is the wrong trade for a server. WAL and synchronous=NORMAL are
    // stored in the database file itself, so setting them once is enough and
    // they apply to every pooled connection.
    //
    // Per-connection pragmas are not set here: Prisma's SQLite connector already
    // enables foreign-key enforcement and applies a busy timeout on each
    // connection it opens, and a pragma issued through the pool would only reach
    // whichever connection served it.
    //
    // These return a result row, so they need $queryRawUnsafe, not $executeRawUnsafe.
    await this.$queryRawUnsafe('PRAGMA journal_mode = WAL');
    await this.$queryRawUnsafe('PRAGMA synchronous = NORMAL');

    this.logger.log('Database connected (SQLite, WAL mode)');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
