import { Model } from 'objection';
// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const __filename = import.meta.url.startsWith('file://')
  ? decodeURIComponent(import.meta.url.slice(8))
  : import.meta.url;


// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

console.log(import.meta.url);
console.log(__filename);
console.log(__dirname);


export class BaseModel extends Model {
  static get modelPaths() {
    return [__dirname];
  }

  static get idColumn() {
    return 'id';
  }
}
