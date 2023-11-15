import { feedController } from '@/controllers';
import ensureAuthenticated from '@/middleware/ensureAuthenticated';
import { Router } from 'express';

const feedRouter = Router();

feedRouter.get('/', ensureAuthenticated, feedController.getFeed);

export default feedRouter;
