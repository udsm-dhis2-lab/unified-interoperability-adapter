import { MsdCode } from '../';

export class MsdCodePage {
  total!: number;
  pageIndex!: number;
  pageSize!: number;
  listOfMsdCodes!: MsdCode[];

  static fromJson(json: any): MsdCodePage {
    const msdCodePage = new MsdCodePage();
    msdCodePage.total = json?.pager?.total ?? 0;
    msdCodePage.pageIndex = json?.pager?.page ?? 0;
    msdCodePage.pageSize = json?.pager?.pageSize ?? 0;
    msdCodePage.listOfMsdCodes = (json?.results ?? []).map((item: any) =>
        MsdCode.fromJson(item)
    );
    return msdCodePage;
  }
}
