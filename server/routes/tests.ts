import { Router } from 'express';
import { Client as TemporalClient } from '@temporalio/client';
import { ClientService } from '@hotmeshio/hotmesh/build/services/meshflow/client';
import { HotMesh } from '@hotmeshio/hotmesh';
import { v4 as uuid } from 'uuid';
import { initWorkerRouter } from '../../examples/hotmesh/worker';
import { initEngineRouter } from '../../examples/hotmesh/client';

export const testRoutes = (temporalClient: TemporalClient, hotMeshClient: ClientService) => {
  const router = Router();

  // Start a Temporal Workflow
  const startTemporalWorkflow = async () => {
    const workflowId = `temporal-${uuid()}`;
    const handle = await temporalClient.workflow.start('greetMultiple', {
      args: [],
      taskQueue: 'default',
      workflowId,
    });
    return handle.result();
  };

  // Start a MeshFlow Workflow
  const startMeshFlowWorkflow = async () => {
    const workflowId = `meshflow-${uuid()}`;
    const handle = await hotMeshClient.workflow.start({
      workflowId,
      namespace: 'meshflow',
      taskQueue: 'example',
      workflowName: 'greetMultiple',
      args: [],
    });
    return handle.result();
  };

  // Start a HotMesh Workflow
  let hotMesh: HotMesh; //late bind (sometimes the script that updates the temporal db takes a while)
  const startHotMeshWorkflow = async () => {
    if (!hotMesh) {
      //initialize the `worker router`
      await initWorkerRouter();

      //keep a ref to the `engine router`; it's the entry point to the mesh
      hotMesh = await initEngineRouter();
    }

    console.log('Starting HotMesh workflow...');
    const result = await hotMesh.pubsub('greetMultiple', {});
    return result.data;
  };

  // Combined Test Route
  router.get('/', async (req, res) => {
    try {
      const [temporalResult, meshFlowResult, hotMeshResult] = await Promise.all([
        startTemporalWorkflow(),
        startMeshFlowWorkflow(),
        startHotMeshWorkflow(),
      ]);
      res.json({ temporalResult, meshFlowResult, hotMeshResult });
    } catch (error) {
      console.error('Error processing workflows:', error);
      res.status(500).json({ error: 'An error occurred while processing workflows' });
    }
  });

  // Temporal Test Route
  router.get('/temporal', async (req, res) => {
    try {
      res.json({ temporal: await startTemporalWorkflow() });
    } catch (error) {
      console.error('Error processing Temporal workflow:', error);
      res.status(500).json({ error: 'An error occurred while processing the Temporal workflow' });
    }
  });

  // MeshFlow Test Route
  router.get('/meshflow', async (req, res) => {
    try {
      res.json({ meshflow: await startMeshFlowWorkflow() });
    } catch (error) {
      console.error('Error processing MeshFlow workflow:', error);
      res.status(500).json({ error: 'An error occurred while processing the MeshFlow workflow' });
    }
  });

  // HotMesh Test Route
  router.get('/hotmesh', async (req, res) => {
    try {
      res.json({ hotmesh: await startHotMeshWorkflow() });
    } catch (error) {
      console.error('Error processing HotMesh workflow:', error);
      res.status(500).json({ error: 'An error occurred while processing the HotMesh workflow' });
    }
  });

  return router;
};
