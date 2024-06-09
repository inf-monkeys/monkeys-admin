import * as express from 'express';

export interface IRequest extends express.Request {
  context: IContext;
}

export interface IContext {
  appId: string;
  userId: string;
  teamId: string;
  workflowId: string;
  workflowInstanceId: string;
  taskId: string;
}
