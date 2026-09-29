import { Injectable } from '@nestjs/common';

@Injectable()
export class PostgresSearchIndexer {
  async indexDocument(collection: string, docId: string, text: string): Promise<void> {}
}
