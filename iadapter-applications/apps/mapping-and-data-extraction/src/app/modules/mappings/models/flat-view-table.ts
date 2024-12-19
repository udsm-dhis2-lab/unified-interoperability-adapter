export class FlatViewTable {
  tableCode!: string;
  tableName!: string;
  fields!: Field[];

  static fromJson(json: any): FlatViewTable {
    const table = new FlatViewTable();
    table.tableName = json?.value?.tableName;
    table.tableCode = json?.value?.tableCode;
    table.fields = (json?.value?.fields ?? []).map((item: any) =>
      Field.fromJson(item)
    );

    return table;
  }
}

export class Field {
  code!: string;
  name!: string;
  type!: string;
  table!: string;

  static fromJson(json: any): Field {
    const field = new Field();
    field.code = json.code;
    field.name = json.name;
    field.type = json.type;
    field.table = json.table;
    return field;
  }
}
