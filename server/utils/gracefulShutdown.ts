import { MeshFlow } from '@hotmeshio/hotmesh';

const gracefulShutdown = () => {
  process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await MeshFlow.shutdown();
  });
};

export default gracefulShutdown;
