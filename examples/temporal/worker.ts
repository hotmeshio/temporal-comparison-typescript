import { Worker, NativeConnection, NativeConnectionOptions } from '@temporalio/worker';
import * as activities from '../activities';

export const runWorker = async () => {
  const connection = await NativeConnection.connect({ address: 'temporal:7233' } as NativeConnectionOptions);
  const worker = await Worker.create({
    connection,
    namespace: 'default',
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: 'default'
  });

  console.log('Starting Temporal worker on task queue `default`...');
  await worker.run();
}

/**
 * Autoruns the Temporal worker in its own process. (The MeshFlow
 * worker also runs in its own process.) No reason for this, just
 * wanted to show distributed workers for each platform, as 
 * this is essentially their specialty: to broker/orchestrate
 * distributed workflows.
 */
runWorker().catch((err) => {
  console.error('Failed to start worker:', err);
  process.exit(1);
});