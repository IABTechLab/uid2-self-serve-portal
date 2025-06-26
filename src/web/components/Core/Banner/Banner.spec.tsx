import { render, screen } from '@testing-library/react';
import { Info } from './Banner.stories';
import { Banner } from './Banner';


test('has icon and message rendered', () => {
  render(<Banner {...Info.args} />);
  const title = screen.getByTestId('banner-message');
  expect(title.textContent).toContain(Info.args?.message);
  expect(screen.getByTestId('banner-icon')).toBeInTheDocument();
});
