import { workflow } from '@hotmeshio/hotmesh';
import * as activities from '../activities';

const { greet } = workflow.proxyActivities<typeof activities>({
  activities, // Required for HotMesh
  retryPolicy: {
    maximumAttempts: 5,
    maximumInterval: '1 minute',
    backoffCoefficient: 2,
  }
});

export const greetMultiple = async (): Promise<Record<string, string>> => {
  const names = ['Alice', 'Bob', 'Charlie'];
  const promises = names.map(name => greet(name));
  const results = await Promise.all(promises);
  await workflow.trace({'app.custom.string': results.join(', ')});
  return {
    greeting1: results[0],
    greeting2: results[1],
    greeting3: results[2],
  };
};
