export class Option {
  code!: string;
  name!: string;

  static fromJson(json: any): Option {
    const option = new Option();
    option.code = json['code'];
    option.name = json['name'];
    return option;
  }

  toJson(): any {
    return {
      code: this.code,
      name: this.name,
    };
  }
}
