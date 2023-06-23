import { Model } from 'objection';
import { z } from 'zod';

import { BaseModel } from './BaseModel';

export class Approver extends BaseModel {
  static get tableName() {
    return 'approvers';
  }
  static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'ParticipantType',
      join: {
        from: 'approvers.participantTypeId',
        to: 'participantsToTypes.id',
      },
    },
  };
  id!: number;
  email!: string;
  participantTypeId!: number;
  displayName!: string;
}
