// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// eslint-disable-next-line import/no-extraneous-dependencies
import { setProjectAnnotations } from '@storybook/react-webpack5';

import * as globalStorybookConfig from '../.storybook/preview';
import { configureFontAwesomeLibrary } from './web/configureFontAwesomeLibrary';

setProjectAnnotations(globalStorybookConfig);
configureFontAwesomeLibrary();

window.HTMLElement.prototype.scrollIntoView = jest.fn();
window.HTMLElement.prototype.releasePointerCapture = jest.fn();
window.HTMLElement.prototype.hasPointerCapture = jest.fn();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, import/no-extraneous-dependencies
global.ResizeObserver = require('resize-observer-polyfill');
