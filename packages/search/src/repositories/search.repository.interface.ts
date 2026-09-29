export interface ISearchRepository {
  executeSearch(term: string): Promise<any[]>;
}
