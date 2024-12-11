import { Connection, Client, MeshFlow } from '@hotmeshio/hotmesh';
import { connection as dbConnection } from '../connection';
import { v4 as uuid } from 'uuid';

export const runClient = async () => {
  const connection = await Connection.connect(dbConnection);
  const client = new Client({ connection });
  const workflowId = `greet-multiple-${uuid()}`;

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
