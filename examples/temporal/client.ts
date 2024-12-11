import { Connection, Client } from '@temporalio/client';
import { v4 as uuid } from 'uuid';

export const runClient = async() =>{
  const connection = await Connection.connect({ address: 'temporal:7233' });
  const client = new Client({
    connection,
    namespace: 'default',
  });
  const workflowId = `greet-multiple-${uuid()}`;

  const handle = await client.workflow.start('greetMultiple', {
    args: [],
    taskQueue: 'default',
    workflowId,
  });

  console.log(`Started Temporal workflow ${workflowId}. Waiting for result...`);
  const result = await handle.result();
  console.log('Workflow result:', result);
}
