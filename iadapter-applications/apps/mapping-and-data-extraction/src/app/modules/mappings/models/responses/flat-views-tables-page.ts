import { FlatViewTable } from '..';

export class FlatViewsTablesPage {
  pageIndex!: number;
  pageSize!: number;
  total!: number;
  listOfFlatViewsTables!: FlatViewTable[];

  static fromJson(json: any): FlatViewsTablesPage {
    const page = new FlatViewsTablesPage();
    page.pageIndex = json?.pager?.page ?? 0;
    page.pageSize = json?.pager?.pageSize ?? 0;
    page.total = json?.pager?.total ?? 0;
    page.listOfFlatViewsTables = (json?.results ?? []).map((item: any) =>
      FlatViewTable.fromJson(item)
    );
    return page;
  }
}
