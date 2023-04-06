import { NonFunctionPropertyNames } from 'objection';

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
export type ModelObjectOpt<T> = Omit<NonFunctionProperties<T>, 'QueryBuilderType'>;
