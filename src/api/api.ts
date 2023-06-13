import { Configure } from '../database/SelfServeDatabase';
import { configureApi } from './configureApi';

Configure();
const app = configureApi();

export default app;
