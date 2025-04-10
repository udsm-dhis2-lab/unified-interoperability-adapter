import { Deduplication } from '../index';

export class DeduplicationPage {
  data!: Deduplication[];
  total!: number;
  pageIndex!: number;
  pageSize!: number;

  static fromJson(json: any): DeduplicationPage {
    const deduplicationPage = new DeduplicationPage();
    deduplicationPage.data = (json?.records ?? []).map((item: any) =>
      Deduplication.fromJson(item)
    );
    deduplicationPage.total = json?.total ?? 0;
    deduplicationPage.pageIndex = json?.page ?? 0;
    deduplicationPage.pageSize = json?.pageSize ?? 0;
    return deduplicationPage;
  }
}
