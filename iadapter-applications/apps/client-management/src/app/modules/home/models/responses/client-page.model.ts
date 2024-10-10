import { HduClient } from '../';

export class ClientPage {
  pageIndex!: number;
  pageSize!: number;
  total!: number;
  listOfClients!: HduClient[];

  static fromJson(data: any): ClientPage {
    const clientPage = new ClientPage();
    clientPage.pageIndex = data?.pager?.page ?? 0;
    clientPage.pageSize = data?.pager?.pageSize ?? 0;
    clientPage.total = data?.pager?.total ?? 0;
    clientPage.listOfClients = (data?.results ?? []).map((item: any) =>
      HduClient.fromJson(item)
    );
    return clientPage;
  }
}
