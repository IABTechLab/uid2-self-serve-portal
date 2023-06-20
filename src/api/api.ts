import { Configure } from '../database/SelfServeDatabase';
import { configureAndStartApi } from './configureApi';

Configure();
const app = configureAndStartApi();

export default app;
