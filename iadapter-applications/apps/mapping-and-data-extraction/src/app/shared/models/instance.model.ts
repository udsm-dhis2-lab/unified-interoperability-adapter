export class Instance {
  uuid!: string;
  name!: string;
  url!: string;
  code!: string;

  static fromJson(json: any): Instance {
    const instance = new Instance();
    instance.uuid = json['uuid'];
    instance.name = json['name'];
    instance.url = json['url'];
    instance.code = json['code'];
    return instance;
  }
}
