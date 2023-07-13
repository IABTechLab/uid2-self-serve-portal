import './DocumentationCard.scss';

function DocumentationCard() {
  return (
    <div className='document-card'>
      <img src='/document.svg' alt='document' />
      <div>
        <h2>Documentation</h2>
        <span>Check out documentation for implementation resources</span>
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
    </div>
  );
}

export default DocumentationCard;
