import { Configure } from '../database/SelfServeDatabase';
import { configureAndStartApi } from './configureApi';

Configure();
const app = configureAndStartApi().server;

export default app;
