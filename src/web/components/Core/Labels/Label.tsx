import './Label.scss';

export type LabelProps = Readonly<{
  text: string;
}>;

export function Label({ text }: LabelProps) {
  return <div className='label'>{text}</div>;
}
