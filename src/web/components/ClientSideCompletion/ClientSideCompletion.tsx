import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Card } from '../Core/Card';
import { KeyPairModel } from '../KeyPairs/KeyPairModel';

import './ClientSideCompletion.scss';

type ClientSideCompletionProps = Readonly<{
  keyPairData: KeyPairModel[] | undefined;
  domainNames: string[] | undefined;
}>;
export function ClientSideCompletion({ keyPairData, domainNames }: ClientSideCompletionProps) {
  const hasKeyPairData = !!keyPairData?.filter((kp) => !kp.disabled).length;
  const hasDomainNames = !!domainNames?.length;
  if (hasKeyPairData && hasDomainNames) return null;
  return (
    <Card className='client-side-completion'>
      <h2>
        <FontAwesomeIcon icon='exclamation-triangle' /> Missing Configuration
      </h2>
      <div>Before you can use client-side integration, you must complete the following:</div>
      <ul>
        {!hasKeyPairData && <li>Add at least one key pair.</li>}
        {!hasDomainNames && <li>Provide at least one root-level domain name.</li>}
      </ul>
    </Card>
  );
}
