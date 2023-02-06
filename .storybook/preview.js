import '!style-loader!css-loader!sass-loader!./styles.scss';
import { BrowserRouter } from 'react-router-dom';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <div className='app'>
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    </div>
  ),
];
