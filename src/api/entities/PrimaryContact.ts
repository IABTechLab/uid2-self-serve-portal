import { Model, RelationMappings } from 'objection';

import { Participant } from './Participant.ts';
import { User } from './User.ts';

export class PrimaryContact extends Model {
  static get tableName() {
    return 'primaryContacts';
  }

  static get idColumn() {
    return ['participantId']; // Optional, but helps with certain Objection queries
  }

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: () => User,
        join: {
          from: 'primaryContacts.userId',
          to: 'users.id',
        },
      },
      participant: {
        relation: Model.BelongsToOneRelation,
        modelClass: () => Participant,
        join: {
          from: 'primaryContacts.participantId',
          to: 'participants.id',
        },
      },
    };
  }

  declare userId: number;
  declare participantId: number;
}
