import { IcdCode } from '../icd-code.model';

export class IcdCodePage {
  total!: number;
  pageIndex!: number;
  pageSize!: number;
  listOfIcdCodes!: IcdCode[];

  static fromJson(json: any): IcdCodePage {
    const icdCodePage = new IcdCodePage();
    icdCodePage.total = json?.pager?.total ?? 0;
    icdCodePage.pageIndex = json?.pager?.page ?? 0;
    icdCodePage.pageSize = json?.pager?.pageSize ?? 0;
    icdCodePage.listOfIcdCodes = (json?.results ?? []).map((item: any) =>
      IcdCode.fromJson(item)
    );
    return icdCodePage;
  }
}
