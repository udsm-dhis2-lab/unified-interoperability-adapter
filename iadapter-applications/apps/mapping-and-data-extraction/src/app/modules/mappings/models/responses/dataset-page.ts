import { Dataset } from '..';

export class DatasetPage {
  total!: number;
  pageSize!: number;
  pageIndex!: number;
  listOfDatasets!: Dataset[];

  static fromJson(json: any): DatasetPage {
    let datasetPage = new DatasetPage();
    datasetPage.total = json?.pager?.total ?? 0;
    datasetPage.pageSize = json?.pager?.pageSize ?? 0;
    datasetPage.pageIndex = json?.pager?.page ?? 0;
    datasetPage.listOfDatasets = (json?.results ?? []).map((item: any) =>
      Dataset.fromJson(item)
    );
    return datasetPage;
  }
}
