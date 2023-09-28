import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { ChangeEvent, ReactNode, useState } from 'react';
import { parse } from 'tldts';
import { useDebouncedCallback } from 'use-debounce';

import { InlineMessage } from '../Core/InlineMessage';

import './CstgDomainInputRow.scss';

type CstgDomainInputRowProps = {
  onAdd: (newDomain: string) => Promise<void>;
  onCancel: () => void;
};

type DomainProps = {
  isIcann: boolean | null;
  isPrivate: boolean | null;
  domain: string | null;
};

type DomainValidationResult = {
  type: 'Error' | 'Warning';
  message: ReactNode;
};

type ValidDomainProps = Omit<DomainProps, 'domain'> & { domain: string };

export function CstgDomainInputRow({ onAdd, onCancel }: CstgDomainInputRowProps) {
  const [newDomain, setNewDomain] = useState<string>('');
  const [validationResult, setValidationResult] = useState<DomainValidationResult | null>();

  const updateToNormalizedValue = (normalizedValue: string) => {
    setNewDomain(normalizedValue);
    setValidationResult(null);
  };

  const handleCancel = () => {
    setNewDomain('');
    setValidationResult(null);
    onCancel();
  };

  const isValidDomain = (domainProps: DomainProps): domainProps is ValidDomainProps => {
    return Boolean((domainProps.isIcann || domainProps.isPrivate) && domainProps.domain);
  };

  const validateDomain = useDebouncedCallback((inputValue: string) => {
    const domainProps = parse(inputValue);
    if (isValidDomain(domainProps)) {
      const { domain: topLevelDomain } = domainProps;
      if (topLevelDomain !== newDomain)
        setValidationResult({
          type: 'Warning',
          message: (
            <div
              className='domain-input-recommended-message'
              data-testid='domain-input-recommended-message'
            >
              <span>
                We only need the top-level domain. Do you mean <b>{topLevelDomain}</b>?
              </span>
              <button
                type='button'
                data-testid='domain-input-recommended-domain'
                className='transparent-button small-button'
                onClick={() => updateToNormalizedValue(topLevelDomain)}
              >
                Use Recommended Domain Instead
              </button>
            </div>
          ),
        });
    } else {
      setValidationResult({
        type: 'Error',
        message: <span data-testid='domain-input-error-message'>Invalid domain</span>,
      });
    }
  }, 500);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setNewDomain(input);
    setValidationResult(null);
    validateDomain(input);
  };

  return (
    <tr>
      <td>
        <button
          className='icon-button domain-input-remove-button'
          type='button'
          onClick={handleCancel}
        >
          <FontAwesomeIcon icon='minus' />
        </button>
      </td>
      <td className='domain'>
        <div className='domain-input-field'>
          <input
            data-testid='domain-input-field'
            className={clsx('input-container', validationResult?.type)}
            value={newDomain}
            onChange={handleInputChange}
          />
          {validationResult && (
            <InlineMessage message={validationResult!.message} type={validationResult!.type} />
          )}
        </div>
      </td>
      <td className='action'>
        <div className='action-cell'>
          <button
            type='button'
            data-testid='domain-input-save-btn'
            className='transparent-button'
            onClick={() => onAdd(newDomain)}
            disabled={!!validationResult}
          >
            Save
          </button>
        </div>
      </td>
    </tr>
  );
}
