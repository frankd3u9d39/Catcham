import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  async queryReportsAndCases(term: string, filters?: any): Promise<any[]> {
    return [];
  }
}
