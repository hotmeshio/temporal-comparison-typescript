/**
 * This is the entry point that starts the HTTP server. It provides
 * a persistent connection to the Temporal, MeshFlow and HotMesh clients
 * and provides access via a RESTful API.
 * 
 * Tests (HTTP GET requests) are available at:
 * 
 * temporal: http://localhost:3010/api/v1/test/temporal
 * meshflow: http://localhost:3010/api/v1/test/meshflow
 * hotmesh: http://localhost:3010/api/v1/test/hotmesh
 * combined: http://localhost:3010/api/v1/test
 */
import 'dotenv/config';
import express from 'express';
import { initializeClients } from './initializers/clients';
import { testRoutes } from './routes/tests';
import gracefulShutdown from './utils/gracefulShutdown';
import { setupTelemetry } from '../modules/tracer';

const app = express();
const port = 3010;

(async () => {
  try {
    console.log('Initializing client services...');
    setupTelemetry();

    // Initialize clients 
    //(NOTE: HotMesh is late-bound and isn't loaded until the first request)
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
