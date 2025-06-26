import { Model, RelationMappings } from 'objection';

export class BaseModel extends Model {
	// Define a model path to solve circular dependencies issues in many-to-many relation mapping
  static get modelPaths() {
    return ['src/api/entities'];
  }
  static get idColumn() {
    return 'id';
  }

	static async getRelationMappingsAsync(): Promise<RelationMappings> {
    return (this as typeof Model & { relationMappings: RelationMappings }).relationMappings;
  }
}
