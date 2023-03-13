// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronDown,
  faEllipsisH,
  faPencil,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
// eslint-disable-next-line import/no-extraneous-dependencies
import { setGlobalConfig } from '@storybook/testing-react';

import * as globalStorybookConfig from '../.storybook/preview';

setGlobalConfig(globalStorybookConfig);
library.add(faEllipsisH);
library.add(faPencil);
library.add(faTrashCan);
library.add(faChevronDown);
