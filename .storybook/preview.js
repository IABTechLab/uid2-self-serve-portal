import '!style-loader!css-loader!sass-loader!./styles.scss';
import { BrowserRouter } from 'react-router-dom';
import { configureFontAwesomeLibrary } from '../src/web/configureFontAwesomeLibrary';

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
  (Story) => {
    configureFontAwesomeLibrary();
    return (
      <div className='app'>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </div>
    );
  },
];
