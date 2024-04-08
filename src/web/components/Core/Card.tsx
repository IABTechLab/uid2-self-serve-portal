import clsx from 'clsx';

import './Card.scss';

type CardProps = {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};
export function Card({ title, description, className, children }: CardProps) {
  return (
    <div className={clsx('card', className)}>
      {title && (
        <div className='card-header'>
          <h1 data-testid='card-title'>{title}</h1>
          {description && <span data-testid='card-description'>{description}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
