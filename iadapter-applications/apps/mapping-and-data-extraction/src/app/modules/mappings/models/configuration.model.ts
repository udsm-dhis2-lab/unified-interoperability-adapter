export class Configuration {
  key!: string;
  name!: string;
  code!: string;
  uuid?: string;
  options!: { [key: string]: any }[];

  static fromJson(json: any): Configuration {
    const configuration = new Configuration();
    configuration.key = json['key'];
    configuration.name = json['name'];
    configuration.code = json['code'];
    configuration.uuid = json['uuid'];

    if (typeof json['options'] === 'string') {
      try {
        configuration.options = JSON.parse(json['options']);
      } catch (e) {
        configuration.options = [];
      }
    } else {
      configuration.options = json['options'];
    }

    return configuration;
  }

  toJson(): any {
    return {
      key: this.key,
      name: this.name,
      code: this.code,
      options: this.options,
    };
  }
}
