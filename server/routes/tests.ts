import { Router } from 'express';
import { Client as TemporalClient } from '@temporalio/client';
import { ClientService } from '@hotmeshio/hotmesh/build/services/meshflow/client';
import { HotMesh, Types } from '@hotmeshio/hotmesh';
import { v4 as uuid } from 'uuid';
import { initWorkerRouter } from '../../examples/hotmesh/worker';
import { initEngineRouter } from '../../examples/hotmesh/client';
import { getTraceUrl } from '../../modules/tracer';

export const testRoutes = (temporalClient: TemporalClient, hotMeshClient: ClientService) => {
  const router = Router();

  // Start a Temporal Workflow
  const runTemporalWorkflow = async () => {
    const workflowId = `temporal-${uuid()}`;
    const handle = await temporalClient.workflow.start('greetMultiple', {
      args: [],
      taskQueue: 'default',
      workflowId,
    });
    return handle.result();
  };

  // Start a MeshFlow Workflow
  const runMeshFlowWorkflow = async () => {
    const workflowId = `meshflow-${uuid()}`;
    const handle = await hotMeshClient.workflow.start({
      workflowId,
      namespace: 'meshflow',
      taskQueue: 'example',
      workflowName: 'greetMultiple',
      args: [],
    });
    //would return here, but...
    await handle.result();

    //...we need to fetch the state of the workflow for the trace URL
    return await handle.hotMesh.getState(
      `${handle.hotMesh.appId}.execute`,
      handle.workflowId,
    );
  };

  // Start a HotMesh Workflow
  let hotMesh: HotMesh; //late bind (sometimes the script that updates the temporal db takes a while)
  const runHotMeshWorkflow = async (): Promise<Types.JobOutput> => {
    if (!hotMesh) {
      //initialize the `worker router`
      await initWorkerRouter();

      //keep a ref to the `engine router`; it's the entry point to the mesh
      hotMesh = await initEngineRouter();
    }

    console.log('Starting HotMesh workflow...');
    const result = await hotMesh.pubsub('greetMultiple', {});
    return result;
  };

  // Combined Test Route
  router.get('/', async (req, res) => {
    try {
      const [temporalResult, meshFlowResult, hotMeshResult] = await Promise.all([
        runTemporalWorkflow(),
        runMeshFlowWorkflow(),
        runHotMeshWorkflow(),
      ]);
      res.json({ temporalResult, meshFlowResult: meshFlowResult.data, hotMeshResult: hotMeshResult.data });
    } catch (error) {
      console.error('Error processing workflows:', error);
      res.status(500).json({ error: 'An error occurred while processing workflows' });
    }
  });

  // Temporal Test Route
  router.get('/temporal', async (req, res) => {
    try {
      res.json({ temporal: await runTemporalWorkflow() });
    } catch (error) {
      console.error('Error processing Temporal workflow:', error);
      res.status(500).json({ error: 'An error occurred while processing the Temporal workflow' });
    }
  });

  // MeshFlow Test Route
  router.get('/meshflow', async (req, res) => {
    try {
      const jobOutput = await runMeshFlowWorkflow();
      console.log(
        'MeshFlow workflow result',
        jobOutput,
        getTraceUrl(jobOutput.metadata.trc),
      );
      res.json({ meshflow: jobOutput.data?.response });
    } catch (error) {
      console.error('Error processing MeshFlow workflow:', error);
      res.status(500).json({ error: 'An error occurred while processing the MeshFlow workflow' });
    }
  });

  // HotMesh Test Route
  router.get('/hotmesh', async (req, res) => {
    try {
      const jobOutput = await runHotMeshWorkflow();
      console.log(
        'HotMesh workflow result',
        jobOutput,
        getTraceUrl(jobOutput.metadata.trc),
      );
      res.json({ hotmesh: jobOutput.data });
    } catch (error) {
      console.error('Error processing HotMesh workflow:', error);
      res.status(500).json({ error: 'An error occurred while processing the HotMesh workflow' });
    }
  });

  return router;
};
