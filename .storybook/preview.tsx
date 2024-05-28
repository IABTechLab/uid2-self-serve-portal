import '!style-loader!css-loader!sass-loader!./styles.scss';
import { BrowserRouter } from 'react-router-dom';
import { configureFontAwesomeLibrary } from '../src/web/configureFontAwesomeLibrary';
import type { Preview } from '@storybook/react';

const preview: Preview = {
  decorators: [
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
  ],
  tags: ['autodocs'],
};

export default preview;