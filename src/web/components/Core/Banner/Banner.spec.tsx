import { render, screen } from '@testing-library/react';

import { Banner } from './Banner';
import { Info } from './Banner.stories';

test('has icon and message rendered', () => {
  render(<Banner {...Info.args} />);
  const title = screen.getByTestId('banner-message');
  expect(title.textContent).toContain(Info.args?.message);
  expect(screen.getByTestId('banner-icon')).toBeInTheDocument();
});
