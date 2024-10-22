export class IcdCode {
  code!: string;
  name!: string;

  static fromJson(json: any): IcdCode {
    const icdCode = new IcdCode();
    icdCode.code = json.code;
    icdCode.name = json.name;
    return icdCode;
  }
}
