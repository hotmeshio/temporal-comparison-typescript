import { Connection, Client, Utils } from '@hotmeshio/hotmesh';
import { connection as dbConnection } from '../connection';

/**
 * Run a MeshFlow workflow (HotMesh's Temporal equivalent)
 */
export const runClient = async () => {
  const connection = await Connection.connect(dbConnection);
  const client = new Client({ connection });
  const workflowId = `meshflow-${Utils.guid()}`;

  const handle = await client.workflow.start({
    workflowId,
    namespace: 'meshflow',
    taskQueue: 'example',
    workflowName: 'greetMultiple',
    args: [],
  });

  console.log(`Started MeshFlow workflow ${workflowId}. Waiting for result...`);
  const result = await handle.result();
  console.log('Workflow result:', result);
}
