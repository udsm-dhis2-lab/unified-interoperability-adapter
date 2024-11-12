import { LoincCode } from '../';

export class LoincCodePage {
  total!: number;
  pageIndex!: number;
  pageSize!: number;
  listOfIcdCodes!: LoincCode[];

  static fromJson(json: any): LoincCodePage {
    const loincCodePage = new LoincCodePage();
    loincCodePage.total = json?.pager?.total ?? 0;
    loincCodePage.pageIndex = json?.pager?.page ?? 0;
    loincCodePage.pageSize = json?.pager?.pageSize ?? 0;
    loincCodePage.listOfIcdCodes = (json?.results ?? []).map((item: any) =>
      LoincCode.fromJson(item)
    );
    return loincCodePage;
  }
}
