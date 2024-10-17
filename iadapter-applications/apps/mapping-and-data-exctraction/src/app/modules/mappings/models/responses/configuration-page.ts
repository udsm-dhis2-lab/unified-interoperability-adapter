import { Configuration } from '..';

export class ConfigurationPage {
  pageIndex!: number;
  pageSize!: number;
  total!: number;
  listOfConfigurations!: Configuration[];

  static fromJson(json: any): ConfigurationPage {
    const page = new ConfigurationPage();
    page.pageIndex = json?.pager?.page ?? 0;
    page.pageSize = json?.pager?.pageSize ?? 0;
    page.total = json?.pager?.total ?? 0;
    page.listOfConfigurations = (json?.results ?? []).map((item: any) =>
      Configuration.fromJson(item)
    );
    return page;
  }
}
