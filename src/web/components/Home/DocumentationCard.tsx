import { useIdentityConfig } from '../../utils/identity';
import { Card } from '../Core/Card/Card';

import './DocumentationCard.scss';

function DocumentationCard() {
  const { productName, docsBaseUrl } = useIdentityConfig();
  return (
    <Card className='document-card'>
      <img src='/document.svg' alt='document' width='50px' />
      <div>
        <h2>Documentation</h2>
        <span>Check out documentation for implementation resources</span>
        <a href={`${docsBaseUrl}/category/uid2-portal`} target='_blank' rel='noreferrer'>
          {productName} Portal Documentation
        </a>
        <a
          href={`${docsBaseUrl}/overviews/overview-publishers`}
          target='_blank'
          rel='noreferrer'
        >
          Publishers
        </a>
        <a
          href={`${docsBaseUrl}/overviews/overview-advertisers`}
          target='_blank'
          rel='noreferrer'
        >
          Advertisers
        </a>
        <a
          href={`${docsBaseUrl}/overviews/overview-dsps`}
          target='_blank'
          rel='noreferrer'
        >
          DSPs
        </a>
        <a
          href={`${docsBaseUrl}/overviews/overview-data-providers`}
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
