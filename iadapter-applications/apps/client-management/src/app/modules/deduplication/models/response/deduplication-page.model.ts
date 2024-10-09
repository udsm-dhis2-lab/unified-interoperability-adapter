import { Deduplication } from '../index';

export class DeduplicationPage {
  data!: Deduplication[];
  total!: number;
  pageIndex!: number;
  pageSize!: number;

  static fromJson(json: any): DeduplicationPage {
    const deduplicationPage = new DeduplicationPage();
    deduplicationPage.data = (json?.results ?? []).map((item: any) =>
      Deduplication.fromJson(item)
    );
    deduplicationPage.total = json?.pager?.total ?? 0;
    deduplicationPage.pageIndex = json?.pager?.page ?? 0;
    deduplicationPage.pageSize = json?.pager?.pageSize ?? 0;
    return deduplicationPage;
  }
}
