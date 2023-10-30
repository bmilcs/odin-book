import { feedController } from '@/controllers';
import { Router } from 'express';

const feedRouter = Router();

feedRouter.get('/', feedController.getFeed);

export default feedRouter;
