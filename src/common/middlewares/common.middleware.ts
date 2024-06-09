import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { IRequest } from '../typings/request.js';

@Injectable()
export class CommonMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: IRequest, res: Response, next: () => void) {
    req.context = {
      appId: req.headers['x-monkeys-appid'] as string,
      userId: req.headers['x-monkeys-userid'] as string,
      teamId: req.headers['x-monkeys-teamid'] as string,
      workflowInstanceId: req.headers['x-monkeys-workflow-instanceid'] as string,
      taskId: req.headers['x-monkeys-workflow-taskid'] as string,
      workflowId: req.headers['x-monkeys-workflow-id'] as string,
    };

    next();
  }
}
