import 'reflect-metadata';

import { Configure } from '../database/SelfServeDatabase.ts';
import { configureAndStartApi } from './configureApi';

Configure();
const app = configureAndStartApi().server;

export default app;
