import { HotMesh } from '@hotmeshio/hotmesh';
import { connection } from '../connection';

/**
 * Initializes a HotMesh engine router. The router is bound to
 * the `hotmesh` namespace and connects to a Postgres database.
 */
export const initEngineRouter = async () => {
  const hotMesh = await HotMesh.init({
    appId: 'hotmesh',
    engine: { connection },
  });
  await hotMesh.deploy('../app/examples/hotmesh/workflows.yaml');
  await hotMesh.activate('1');
  return hotMesh;
}
