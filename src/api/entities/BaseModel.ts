import { Model, RelationMappings } from 'objection';

export class BaseModel extends Model {
  static get idColumn() {
    return 'id';
  }

	static async getRelationMappingsAsync(): Promise<RelationMappings> {
    return (this as typeof Model & { relationMappings: RelationMappings }).relationMappings;
  }
}
