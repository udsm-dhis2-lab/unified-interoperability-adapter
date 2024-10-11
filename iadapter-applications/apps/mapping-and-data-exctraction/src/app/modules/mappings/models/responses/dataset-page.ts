import { Dataset } from '../';

export class DatasetPage {
  total!: number;
  pageSize!: number;
  pageIndex!: number;
  listOfDatasets!: Dataset[];

  static fromJson(json: any): DatasetPage {
    let datasetPage = new DatasetPage();
    datasetPage.total = json.total;
    datasetPage.pageSize = json.pageSize;
    datasetPage.pageIndex = json.pageIndex;
    datasetPage.listOfDatasets = (json?.results ?? []).map((item: any) =>
      Dataset.fromJson(item)
    );
    return datasetPage;
  }
}
