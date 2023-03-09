import { Model } from 'objection';

export class BaseModel extends Model {
  // Define a model path to solve circular dependencies issues in many-to-many relation mapping
  static get modelPaths() {
    return [__dirname];
  }
  static get idColumn() {
    return 'id';
  }
}
