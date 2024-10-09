import { Label } from './Label';

import './LabelRow.scss';

export type LabelRowProps = Readonly<{
  labelNames: string[];
}>;

export function LabelRow({ labelNames }: LabelRowProps) {
  return (
    <div className='label-row'>
      {labelNames.map((labelName) => (
        <Label text={labelName} key={labelName} />
      ))}
    </div>
  );
}
