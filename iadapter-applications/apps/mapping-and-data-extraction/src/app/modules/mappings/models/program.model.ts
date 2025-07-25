export class Program {
    id!: string;
    name!: string;
    programType!: string;
    description?: string;

    static fromJson(json: any): Program {
        let program = new Program();
        program.id = json['id'] ?? '';
        program.name = json['displayName'] ?? json['name'] ?? '';
        program.programType = json['programType'] ?? '';
        program.description = json['description'] ?? '';
        return program;
    }
}