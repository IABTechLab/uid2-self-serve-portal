import { BaseModel } from './BaseModel.ts';
import { ModelObjectOpt } from './ModelObjectOpt.ts';

export class SignedParticipant extends BaseModel {
  static get tableName() {
    return 'signedParticipants';
  }
  declare name: string;
}

export type SignedParticipantDTO = ModelObjectOpt<SignedParticipant>;
