import { Program } from '../program.model';

export class ProgramPage {
    total!: number;
    pageIndex!: number;
    pageSize!: number;
    listOfPrograms!: Program[];

    static fromJson(json: any): ProgramPage {
        let programPage = new ProgramPage();
        programPage.total = json?.pager?.total ?? 0;
        programPage.pageSize = json?.pager?.pageSize ?? 0;
        programPage.pageIndex = json?.pager?.page ?? 0;
        programPage.listOfPrograms = (json?.results ?? []).map((item: any) =>
            Program.fromJson(item)
        );
        return programPage;
    }
}
