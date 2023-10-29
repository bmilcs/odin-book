import { postController } from '@/controllers';
import { Router } from 'express';

const postRouter = Router();

postRouter.post('/', postController.createPost);

postRouter.get('/:id', postController.getPost);

postRouter.patch('/:id', postController.updatePost);

postRouter.delete('/:id', postController.deletePost);

postRouter.post('/:id/like', postController.likePost);

postRouter.delete('/:id/like', postController.unlikePost);

postRouter.post('/:id/comments', postController.addComment);

postRouter.patch('/:id/comments/:commentId', postController.editComment);

postRouter.delete('/:id/comments/:commentId', postController.deleteComment);

export default postRouter;
