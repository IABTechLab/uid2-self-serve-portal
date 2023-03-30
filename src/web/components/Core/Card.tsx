import './Card.scss';

type CardProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};
export function Card({ title, description, children }: CardProps) {
  return (
    <div className='card'>
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
