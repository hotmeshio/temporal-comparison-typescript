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

runWorker().catch((err) => {
  console.error('Failed to start worker:', err);
  process.exit(1);
});