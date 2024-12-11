import { Worker } from '@hotmeshio/hotmesh';
import { connection } from '../connection';
import * as workflows from './workflows';

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

runWorker().catch(err => {
  console.error(err);
  process.exit(1);
});
