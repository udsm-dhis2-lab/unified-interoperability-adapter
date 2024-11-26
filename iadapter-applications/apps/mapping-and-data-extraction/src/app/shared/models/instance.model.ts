export class Instance {
  uuid!: string;
  name!: string;

  static fromJson(json: any): Instance {
    const instance = new Instance();
    instance.uuid = json['uuid'];
    instance.name = json['name'];
    return instance;
  }
}
