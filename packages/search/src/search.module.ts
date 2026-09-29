import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';
import { PostgresSearchIndexer } from './indexers/postgres-search.indexer';

@Module({
  controllers: [SearchController],
  providers: [SearchService, PostgresSearchIndexer],
  exports: [SearchService],
})
export class SearchModule {}
