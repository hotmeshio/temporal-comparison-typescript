import 'dotenv/config';
import express from 'express';
import path from 'path';
import { initializeClients } from './initializers/clients';
import { testRoutes } from './routes/tests';
import gracefulShutdown from './utils/gracefulShutdown';
import { setupTelemetry } from '../modules/tracer';

const appRoot = process.cwd();

const app = express();
const port = 3010;

(async () => {
  try {
    setupTelemetry();

    // Health Check
    app.get('/health', (req, res) => {
      res.status(200).send('OK');
    });

    // Serve the favicon
    app.use('/favicon.ico', express.static(path.join(appRoot, 'docs/img/favicon.ico')));

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
