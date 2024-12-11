import { MeshFlow } from '@hotmeshio/hotmesh';
import { shutdownTelemetry } from '../../modules/tracer';

const gracefulShutdown = () => {
  process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await MeshFlow.shutdown();
    await shutdownTelemetry();
  });
};

export default gracefulShutdown;
