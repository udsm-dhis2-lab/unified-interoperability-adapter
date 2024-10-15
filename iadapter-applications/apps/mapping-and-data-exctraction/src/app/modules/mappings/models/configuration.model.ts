import { Option } from './options.model';

export class Configuration {
  key!: string;
  name!: string;
  code!: string;
  options!: Option[];

  static fromJson(json: any): Configuration {
    const configuration = new Configuration();
    configuration.key = json['key'];
    configuration.name = json['name'];
    configuration.code = json['code'];
    configuration.options = json['options'].map((item: any) =>
      Option.fromJson(item)
    );
    return configuration;
  }

  toJson(): any {
    return {
      key: this.key,
      name: this.name,
      code: this.code,
      options: [...this.options].map((item) => item.toJson()),
    };
  }
}
