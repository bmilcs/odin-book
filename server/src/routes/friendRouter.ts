import { friendController } from '@/controllers';
import { ensureAuthenticated } from '@/middleware';
import { Router } from 'express';

const friendRouter = Router();

friendRouter.post(
  '/send-request/:userId',
  ensureAuthenticated,
  friendController.sendRequest,
);

friendRouter.patch(
  '/accept-request/:userId',
  ensureAuthenticated,
  friendController.acceptRequest,
);

friendRouter.patch(
  '/reject-request/:userId',
  ensureAuthenticated,
  friendController.rejectRequest,
);

friendRouter.delete(
  '/:userId',
  ensureAuthenticated,
  friendController.deleteFriend,
);

export default friendRouter;
