import { postController } from '@/controllers';
import ensureAuthenticated from '@/middleware/ensureAuthenticated';
import { Router } from 'express';

const postRouter = Router();

postRouter.post('/', ensureAuthenticated, postController.createPost);

postRouter.get('/:id', ensureAuthenticated, postController.getPost);

postRouter.patch('/:id', ensureAuthenticated, postController.updatePost);

postRouter.delete('/:id', ensureAuthenticated, postController.deletePost);

postRouter.post('/:id/like', ensureAuthenticated, postController.likePost);

postRouter.delete('/:id/like', ensureAuthenticated, postController.unlikePost);

postRouter.post(
  '/:id/comments',
  ensureAuthenticated,
  postController.addComment,
);

postRouter.patch(
  '/:id/comments/:commentId',
  ensureAuthenticated,
  postController.editComment,
);

postRouter.delete(
  '/:id/comments/:commentId',
  ensureAuthenticated,
  postController.deleteComment,
);

export default postRouter;
