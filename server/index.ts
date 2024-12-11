// app.ts - Main Entry Point
import express from 'express';
import { initializeClients } from './initializers/clients';
import { testRoutes } from './routes/tests';
import gracefulShutdown from './utils/gracefulShutdown';

const app = express();
const port = 3010;

(async () => {
  try {
    console.log('Initializing services...');

    // Initialize clients
    const { temporalClient, meshFlowClient } = await initializeClients();

    // Attach routes
    app.use('/api/v1/test', testRoutes(temporalClient, meshFlowClient));

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/api/v1/test`);
    });

    // Handle graceful shutdown
    gracefulShutdown();
  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
})();
