import { composeStories } from '@storybook/testing-react';
import { render, screen } from '@testing-library/react';

import * as StatusPopupStories from './StatusPopup.stories';

const { Success, Error, Info } = composeStories(StatusPopupStories);

test('renders success status popup', () => {
  render(<Success />);
  expect(screen.getByText(/Success! Your action was successful./i)).toBeInTheDocument();
});

test('renders error status popup', () => {
  render(<Error />);
  expect(screen.getByText(/Error! Something went wrong./i)).toBeInTheDocument();
});

test('renders info status popup', () => {
  render(<Info />);
  expect(screen.getByText(/Info! This is some information./i)).toBeInTheDocument();
});
