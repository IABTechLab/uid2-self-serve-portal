import { Model } from 'objection';

export class BaseModel extends Model {
  static get modelPaths() {
    return ['src/api/entities'];
  }
  static get idColumn() {
    return 'id';
  }
}
