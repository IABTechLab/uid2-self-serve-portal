import 'reflect-metadata';

import { Configure } from '../database/SelfServeDatabase.ts';
import { configureAndStartApi } from './configureApi';

Configure();
const app = configureAndStartApi().server;

export default app;

// const PORT = 6540;

// (async () => {
//   try {
//     console.log('🔧 Configuring database...');
//     Configure();

//     console.log('🚀 Starting API server...');
//     const { server } = configureAndStartApi();

//     server.listen(PORT, () => {
//       console.log(`✅ API server is running at http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error('❌ Failed to start API server:', err);
//     process.exit(1);
//   }
// })();
