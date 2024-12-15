export class MsdCode {
  code!: string;
  name!: string;

  static fromJson(json: any): MsdCode {
    const msdCode = new MsdCode();
    msdCode.code = json.code;
    msdCode.name = json.name;
    return msdCode;
  }
}
