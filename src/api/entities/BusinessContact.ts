import { Model, RelationMappings } from 'objection';

import { BaseModel } from './BaseModel';

export enum ContactType {
  Business = 'Business',
  Technical = 'Technical',
}

export class BusinessContact extends BaseModel {
  static get tableName() {
    return 'businessContacts';
  }

  static get relationMappings(): RelationMappings {
    return {
      participant: {
        relation: Model.BelongsToOneRelation,
        modelClass: () => import('./Participant').then(m => m.Participant) as unknown as typeof Model,
        join: {
          from: 'businessContacts.participantId',
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
