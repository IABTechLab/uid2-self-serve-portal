import { Card } from '../Core/Card';

import './DocumentationCard.scss';

function DocumentationCard() {
  return (
    <Card className='document-card'>
      <img src='/document.svg' alt='document' width='50px' />
      <div>
        <h2>Documentation</h2>
        <span>Check out documentation for implementation resources</span>
        <a href='https://unifiedid.com/docs/category/uid2-portal' target='_blank' rel='noreferrer'>
          UID2 Portal Documentation
        </a>
        <a
          href='https://unifiedid.com/docs/overviews/overview-publishers'
          target='_blank'
          rel='noreferrer'
        >
          Publishers
        </a>
        <a
          href='https://unifiedid.com/docs/overviews/overview-advertisers'
          target='_blank'
          rel='noreferrer'
        >
          Advertisers
        </a>
        <a
          href='https://unifiedid.com/docs/overviews/overview-dsps'
          target='_blank'
          rel='noreferrer'
        >
          DSPs
        </a>
        <a
          href='https://unifiedid.com/docs/overviews/overview-data-providers'
          target='_blank'
          rel='noreferrer'
        >
          Data Providers
        </a>
      </div>
    </Card>
  );
}

export default DocumentationCard;
