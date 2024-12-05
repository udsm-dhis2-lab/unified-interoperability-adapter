export class LoincCode {
  code!: string;
  name!: string;

  static fromJson(json: any): LoincCode {
    const loincCode = new LoincCode();
    loincCode.code = json.code;
    loincCode.name = json.name;
    return loincCode;
  }
}
