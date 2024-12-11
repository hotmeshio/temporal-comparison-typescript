import { Connection as TemporalConnection, Client as TemporalClient } from '@temporalio/client';
import { Connection as MeshFlowConnection, Client as MeshFlowClient } from '@hotmeshio/hotmesh';
import { connection } from '../../examples/connection';

export const initializeClients = async () => {
  //initialize Temporal and MeshFlow clients
  const temporalConnection = await TemporalConnection.connect({ address: 'temporal:7233' });
  const temporalClient = new TemporalClient({ connection: temporalConnection, namespace: 'default' });

  const hotMeshConnection = await MeshFlowConnection.connect(connection);
  const meshFlowClient = new MeshFlowClient({ connection: hotMeshConnection });

  return { temporalClient, meshFlowClient };
};
