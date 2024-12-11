import { HotMesh, HotMeshConfig, Types } from '@hotmeshio/hotmesh';
import { greet } from '../activities';
import { connection } from '../connection';

/**
 * Initializes a HotMesh worker router. The router is bound
 * to the `hotmesh` namespace and connects to a Postgres database.
 */
export const initWorkerRouter = async () => {

  //`config` defines the worker router configuration
  const config: HotMeshConfig = {
    appId: 'hotmesh',   //equivalent to temporal `namespace`
    workers: [
      {
        topic: 'greet', //equivalent to temporal `taskQueue`
        connection,     //equivalent to temporal `connection`

        callback: async (input: Types.StreamData) => {
          return {
            code: 200,
            status: Types.StreamStatus.SUCCESS,
            metadata: { ...input.metadata },
            data:  { greeting: await greet(input.data.name as string) },
          };
        },
      },
    ],
  };

  const hotMesh = await HotMesh.init(config);
  await hotMesh.deploy('../app/examples/hotmesh/workflows.yaml');
  await hotMesh.activate('1');
  return hotMesh;
}
