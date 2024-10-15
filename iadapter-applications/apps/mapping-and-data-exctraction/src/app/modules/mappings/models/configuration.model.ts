import { Option } from './options.model';

export class Configuration {
  key!: string;
  group!: string;
  value!: ConfigurationValue;

  static fromJson(json: any): Configuration {
    console.log('JSONNN', json);
    const configuration = new Configuration();
    configuration.key = json['key'];
    console.log('KEY', json['key']);
    configuration.group = json['group'];
    configuration.value = ConfigurationValue.fromJson(json['value']);
    return configuration;
  }

  toJson (): any {
    return {
      key: this.key,
      group: this.group,
      value: this.value.toJson(),
    };
  }
}

export class ConfigurationValue {
  code!: string;
  name!: string;
  key!: string;
  options!: Option[];

  static fromJson(json: any): ConfigurationValue {
    const configurationValue = new ConfigurationValue();
    configurationValue.code = json['code'];
    configurationValue.name = json['name'];
    configurationValue.key = json['key'];
    configurationValue.options = (json['options'] ?? []).map((option: any) =>
      Option.fromJson(option)
    );
    return configurationValue;
  }

  toJson(): any {
    return {
      code: this.code,
      name: this.name,
      key: this.key,
      options: this.options.map((option) => option.toJson()),
    };
  }
}
