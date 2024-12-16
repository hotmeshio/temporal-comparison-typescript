import { Router } from 'express';
import { Client as TemporalClient } from '@temporalio/client';
import { Client as HotMeshClient, Utils } from '@hotmeshio/hotmesh';
import { HotMesh, Types } from '@hotmeshio/hotmesh';
import { v4 as uuid } from 'uuid';
import { initWorkerRouter } from '../../examples/hotmesh/worker';
import { initEngineRouter } from '../../examples/hotmesh/client';
import { getTraceUrl } from '../../modules/tracer';
import { renderTests } from '../pages/tests';

export const testRoutes = (temporalClient: TemporalClient, hotMeshClient: HotMeshClient) => {
  const router = Router();

  // Workflow functions
  const runTemporalWorkflow = async () => {
    const workflowId = `temporal-${uuid()}`;
    const handle = await temporalClient.workflow.start('greetMultiple', {
      args: [],
      taskQueue: 'default',
      workflowId,
    });
    return handle.result();
  };

  const runMeshFlowWorkflow = async () => {
    const workflowId = `meshflow-${Utils.guid()}`;
    const handle = await hotMeshClient.workflow.start({
      workflowId,
      namespace: 'meshflow',
      taskQueue: 'example',
      workflowName: 'greetMultiple',
      args: [],
      expire: 3600, //expire (soft delete) after 1hr
    });
    await handle.result();
    return await handle.hotMesh.getState(
      `${handle.hotMesh.appId}.execute`,
      handle.workflowId,
    );
  };

  let hotMesh: HotMesh;
  const runHotMeshWorkflow = async (): Promise<Types.JobOutput> => {
    //hotmesh initializes just-in-time. it waits until the first
    // http GET request to initialize the worker/engine routers
    if (!hotMesh) {
      await initWorkerRouter();
      hotMesh = await initEngineRouter();
    }
    const workflowId = `hotmesh-${Utils.guid()}`
    const result = await hotMesh.pubsub('greetMultiple', { workflowId });
    return result;
  };

  // Routes
  router.get('/', async (req, res) => {
    try {
      const [temporalResult, meshFlowResult, hotMeshResult] = await Promise.all([
        runTemporalWorkflow(),
        runMeshFlowWorkflow(),
        runHotMeshWorkflow(),
      ]);
      res.send(
        renderTests(
          'Combined Workflow Results', 
          {
            temporalResult,
            meshFlowResult: meshFlowResult.data.response,
            hotMeshResult: hotMeshResult.data,
          },
          getTraceUrl(meshFlowResult.metadata.trc),
          getTraceUrl(hotMeshResult.metadata.trc),
      ));
    } catch (error) {
      res.status(500).send(renderTests('Error', { error: 'An error occurred while processing workflows' }));
    }
  });

  router.get('/temporal', async (req, res) => {
    try {
      const result = await runTemporalWorkflow();
      res.send(renderTests('Temporal Workflow Result', { temporal: result }));
    } catch (error) {
      res.status(500).send(renderTests('Error', { error: 'An error occurred while processing the Temporal workflow' }));
    }
  });

  router.get('/meshflow', async (req, res) => {
    try {
      const jobOutput = await runMeshFlowWorkflow();
      res.send(
        renderTests(
          'MeshFlow Workflow Result',
          { meshflow: jobOutput.data?.response },
          getTraceUrl(jobOutput.metadata.trc),
        )
        );
    } catch (error) {
      res.status(500).send(renderTests('Error', { error: 'An error occurred while processing the MeshFlow workflow' }));
    }
  });

  router.get('/hotmesh', async (req, res) => {
    try {
      const jobOutput = await runHotMeshWorkflow();
      res.send(
        renderTests(
          'HotMesh Workflow Result',
          { hotmesh: jobOutput.data },
          '',
          getTraceUrl(jobOutput.metadata.trc),
        )
      );
    } catch (error) {
      res.status(500).send(renderTests('Error', { error: 'An error occurred while processing the HotMesh workflow' }));
    }
  });

  router.get('/all', async (req, res) => {
    try {
      const [temporalResult, meshFlowResult, hotMeshResult] = await Promise.all([
        runTemporalWorkflow(),
        runMeshFlowWorkflow(),
        runHotMeshWorkflow(),
      ]);
      res.send(renderTests('All Tests Results', {
        temporalResult,
        meshFlowResult: meshFlowResult.data,
        hotMeshResult: hotMeshResult.data,
      }));
    } catch (error) {
      res.status(500).send(renderTests('Error', { error: 'An error occurred while processing workflows' }));
    }
  });

  return router;
};
