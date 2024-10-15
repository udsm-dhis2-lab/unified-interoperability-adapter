import { IcdCode } from '../icd-code.model';

export class IcdCodePage {
  total!: number;
  pageIndex!: number;
  pageSize!: number;
  listOfIcdCodes!: IcdCode[];

  static fromJson(json: any): IcdCodePage {
    const icdCodePage = new IcdCodePage();
    icdCodePage.total = json.total;
    icdCodePage.pageIndex = json.pageIndex;
    icdCodePage.pageSize = json.pageSize;
    icdCodePage.listOfIcdCodes = json.listOfIcdCodes.map((icdCode: any) =>
      IcdCode.fromJson(icdCode)
    );
    return icdCodePage;
  }
}
