import { Model, RelationMappings } from 'objection';

import { BaseModel } from './BaseModel.ts';
import { Participant } from './Participant.ts';

export enum ContactType {
  Business = 'Business',
  Technical = 'Technical',
}

export class EmailContact extends BaseModel {
  static get tableName() {
    return 'emailContacts';
  }
  static get relationMappings(): RelationMappings {
    return {
      participant: {
        relation: Model.BelongsToOneRelation,
        modelClass: () => Participant,
        join: {
          from: 'emailContacts.participantId',
          to: 'participants.id',
        },
      },
    };
  }

  declare id: number;
  declare name: string;
  declare emailAlias: string;
  declare contactType: string;
  declare participantId: number;
}
