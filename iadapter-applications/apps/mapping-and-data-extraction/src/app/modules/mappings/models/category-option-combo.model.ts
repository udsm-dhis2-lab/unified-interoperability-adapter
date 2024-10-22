export class CategoryOptionCombo {
  id!: string;
  name!: string[];

  static fromJson(json: any) {
    const categoryOptionCombo = new CategoryOptionCombo();
    categoryOptionCombo.id = json['id'];
    categoryOptionCombo.name = json['name'];
    return categoryOptionCombo;
  }
}
