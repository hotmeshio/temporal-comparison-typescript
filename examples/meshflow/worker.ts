import 'dotenv/config';
import { setupTelemetry } from '../../modules/tracer';
import { Worker } from '@hotmeshio/hotmesh';
import { connection } from '../connection';
import * as workflows from './workflows';

setupTelemetry();

async function runWorker() {
  const worker = await Worker.create({
    namespace: 'meshflow',
    taskQueue: 'example',
    connection,
    workflow: workflows.greetMultiple,
  });

  console.log('Starting MeshFlow worker on task queue `example`...');
  await worker.run();
}

/**
 * Autoruns the MeshFlow worker in its own process. (The Temporal
 * worker also runs in its own process.) No reason for this, just
 * wanted to show distributed workers for each platform, as 
 * this is essentially their specialty: to broker/orchestrate
 * distributed workflows.
 */
runWorker().catch(err => {
  console.error(err);
  process.exit(1);
});
