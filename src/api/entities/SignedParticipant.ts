import { BaseModel } from './BaseModel';
import { ModelObjectOpt } from './ModelObjectOpt';

export class SignedParticipant extends BaseModel {
  static get tableName() {
    return 'signedParticipants';
  }
  declare name: string;
}

export type SignedParticipantDTO = ModelObjectOpt<SignedParticipant>;
