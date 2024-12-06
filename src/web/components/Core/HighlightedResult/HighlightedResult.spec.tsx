/* eslint-disable camelcase */
import { render, screen } from '@testing-library/react';
import Fuse from 'fuse.js';
import { SiteDTO } from '../../../../api/services/adminServiceHelpers';
import { HighlightedResult } from './HighlightedResult';

const createResult = (text: string, indices: [number, number][]) => {
  const result: Fuse.FuseResult<SiteDTO> = {
    item: {
      name: text,
      id: 1,
      enabled: true,
      apiRoles: [],
      clientTypes: [],
      client_count: 1,
      visible: false,
      domain_names: [],
      app_names: [],
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
    expect(screen.getByText('Test site')).toBeInTheDocument();
  });
  test('When there is a highlighted section in the middle, it splits the sections up', () => {
    const result = createResult('Test site', [[2, 3]]);
    render(<HighlightedResult result={result} />);
    expect(screen.getByText('Te')).toBeInTheDocument();
    expect(screen.getByText('st')).toBeInTheDocument();
    expect(screen.getByText('site')).toBeInTheDocument();
  });
  test('When there is a highlighted section at the start, it creates two sections', () => {
    const result = createResult('Test site', [[0, 3]]);
    render(<HighlightedResult result={result} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('site')).toBeInTheDocument();
  });
  test('When there is a highlighted section at the end, it creates two sections', () => {
    const result = createResult('Test site', [[5, 8]]);
    render(<HighlightedResult result={result} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('site')).toBeInTheDocument();
  });
  test('When there are highlighted sections at each end, they are separated', () => {
    const result = createResult('Test site', [
      [0, 1],
      [6, 8],
    ]);
    render(<HighlightedResult result={result} />);
    expect(screen.getByText('Te')).toBeInTheDocument();
    expect(screen.getByText('st s')).toBeInTheDocument();
    expect(screen.getByText('ite')).toBeInTheDocument();
  });
});
