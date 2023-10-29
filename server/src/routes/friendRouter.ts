import { friendController } from '@/controllers';
import { Router } from 'express';

const friendRouter = Router();

friendRouter.post('/send-request', friendController.sendRequest);

friendRouter.patch('/accept-request/:id', friendController.acceptRequest);

friendRouter.patch('/reject-request/:id', friendController.rejectRequest);

friendRouter.delete('/:id', friendController.deleteFriend);

export default friendRouter;
