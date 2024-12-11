/**
 * This is an `activity` function. It is called by all three
 * engines used in the example workflows. Each engine uses
 * queueing and scheduling to run this function. Functions like
 * these typcially interact with external services or databases
 * and benefit from the reliability and scalability of the
 * queue-based architecture.
 */
export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
}
