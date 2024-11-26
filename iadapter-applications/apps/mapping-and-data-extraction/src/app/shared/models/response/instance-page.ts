import { Instance } from '..';

export class InstancePage {
  pageIndex!: number;
  pageSize!: number;
  total!: number;
  listOfInstances!: Instance[];

  static fromJson(json: any): InstancePage {
    const instancePage = new InstancePage();
    instancePage.pageIndex = json?.pager?.page ?? 0;
    instancePage.pageSize = json?.pager?.pageSize ?? 0;
    instancePage.total = json?.pager?.total ?? 0;
    instancePage.listOfInstances = (json.results ?? []).map((item: any) =>
      Instance.fromJson(item)
    );
    return instancePage;
  }
}
