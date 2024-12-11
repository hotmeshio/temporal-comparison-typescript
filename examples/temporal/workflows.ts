import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities';

const { greet } = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 seconds',
  retry: {
    maximumAttempts: 5,
    maximumInterval: '1 minute',
    backoffCoefficient: 2,
  }
});

export const greetMultiple = async (): Promise<Record<string, string>> => {
  const names = ['Alice', 'Bob', 'Charlie'];
  const promises = names.map(name => greet(name));
  const results = await Promise.all(promises);
  return {
    greeting1: results[0],
    greeting2: results[1],
    greeting3: results[2],
  };
};