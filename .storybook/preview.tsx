import './styles.scss';
import { BrowserRouter } from 'react-router-dom';
import { configureFontAwesomeLibrary } from '../src/web/configureFontAwesomeLibrary';
import type { Preview } from '@storybook/react-webpack5';

const preview: Preview = {
  decorators: [
    (Story) => {
      configureFontAwesomeLibrary();
      return (
        <div id="root" className='app'>
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