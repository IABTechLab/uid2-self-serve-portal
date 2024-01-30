import { render, screen } from '@testing-library/react';
import Fuse from 'fuse.js';

import { AdminSiteDTO } from '../../../api/services/adminServiceHelpers';
import { HighlightedResult } from './ParticipantApprovalForm';

const createResult = (text: string, indices: [number, number][]) => {
  const result: Fuse.FuseResult<AdminSiteDTO> = {
    item: {
      name: text,
      id: 1,
      enabled: true,
      roles: [],
      clientTypes: [],
      // eslint-disable-next-line camelcase
      client_count: 1,
      visible: false,
    },
    matches: [
      {
        indices,
      },
    ],
    refIndex: 1,
  };
  return result;
};

describe('Highlighted results', () => {
  test('When there are no highlighted sections, it renders the full text', () => {
    const result = createResult('Test site', []);
    render(<HighlightedResult result={result} />);
    screen.getByText('Test site');
  });
  test('When there is a highlighted section in the middle, it splits the sections up', () => {
    const result = createResult('Test site', [[2, 3]]);
    render(<HighlightedResult result={result} />);
    screen.getByText('Te');
    screen.getByText('st');
    screen.getByText('site');
  });
  test('When there is a highlighted section at the start, it creates two sections', () => {
    const result = createResult('Test site', [[0, 3]]);
    render(<HighlightedResult result={result} />);
    screen.getByText('Test');
    screen.getByText('site');
  });
  test('When there is a highlighted section at the end, it creates two sections', () => {
    const result = createResult('Test site', [[5, 8]]);
    render(<HighlightedResult result={result} />);
    screen.getByText('Test');
    screen.getByText('site');
  });
  test('When there are highlighted sections at each end, they are separated', () => {
    const result = createResult('Test site', [
      [0, 1],
      [6, 8],
    ]);
    render(<HighlightedResult result={result} />);
    screen.getByText('Te');
    screen.getByText('st s');
    screen.getByText('ite');
  });
});
