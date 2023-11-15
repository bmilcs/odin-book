import { friendController } from '@/controllers';
import ensureAuthenticated from '@/middleware/ensureAuthenticated';
import { Router } from 'express';

const friendRouter = Router();

friendRouter.post(
  '/send-request',
  ensureAuthenticated,
  friendController.sendRequest,
);

friendRouter.patch(
  '/accept-request/:id',
  ensureAuthenticated,
  friendController.acceptRequest,
);

friendRouter.patch(
  '/reject-request/:id',
  ensureAuthenticated,
  friendController.rejectRequest,
);

friendRouter.delete('/:id', ensureAuthenticated, friendController.deleteFriend);

export default friendRouter;
