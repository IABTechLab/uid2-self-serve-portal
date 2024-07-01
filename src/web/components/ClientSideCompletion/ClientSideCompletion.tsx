import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Card } from '../Core/Card/Card';
import { KeyPairModel } from '../KeyPairs/KeyPairModel';

import './ClientSideCompletion.scss';

type ClientSideCompletionProps = Readonly<{
  keyPairData: KeyPairModel[] | undefined;
  domainNames: string[] | undefined;
  appIds: string[] | undefined;
}>;
export function ClientSideCompletion({
  keyPairData,
  domainNames,
  appIds,
}: ClientSideCompletionProps) {
  const hasKeyPairData = !!keyPairData?.filter((kp) => !kp.disabled).length;
  const hasDomainNames = !!domainNames?.length;
  const hasAppIds = !!appIds?.length;
  if (hasKeyPairData && (hasDomainNames || hasAppIds)) return null;
  return (
    <Card className='client-side-completion'>
      <h2>
        <FontAwesomeIcon icon='triangle-exclamation' /> Missing Configuration
      </h2>
      <div>Before you can use client-side integration, you must complete the following:</div>
      <ul>
        {!hasKeyPairData && <li>Add at least one key pair.</li>}
        <li>Provide at least one root-level domain name or mobile app ID.</li>
      </ul>
    </Card>
  );
}
