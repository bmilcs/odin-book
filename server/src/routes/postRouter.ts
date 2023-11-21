import { postController } from '@/controllers';
import ensureAuthenticated from '@/middleware/ensureAuthenticated';
import { Router } from 'express';

const postRouter = Router();

postRouter.post('/', ensureAuthenticated, postController.createPost);

postRouter.get('/:postId', ensureAuthenticated, postController.getPost);

postRouter.patch('/:postId', ensureAuthenticated, postController.updatePost);

postRouter.delete('/:postId', ensureAuthenticated, postController.deletePost);

postRouter.post('/:postId/like', ensureAuthenticated, postController.likePost);

postRouter.delete(
  '/:postId/like',
  ensureAuthenticated,
  postController.unlikePost,
);

postRouter.delete(
  '/:postId/like',
  ensureAuthenticated,
  postController.unlikePost,
);

postRouter.post(
  '/:postId/comments',
  ensureAuthenticated,
  postController.addComment,
);

postRouter.patch(
  '/:postId/comments/:commentId',
  ensureAuthenticated,
  postController.editComment,
);

postRouter.post(
  '/:postId/comments/:commentId/like',
  ensureAuthenticated,
  postController.likeComment,
);

postRouter.delete(
  '/:postId/comments/:commentId/like',
  ensureAuthenticated,
  postController.unlikeComment,
);

postRouter.delete(
  '/:postId/comments/:commentId',
  ensureAuthenticated,
  postController.deleteComment,
);

export default postRouter;
