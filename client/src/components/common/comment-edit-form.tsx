import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import useUpdateComment from '@/hooks/useUpdateComment';
import { TComment } from '@/utils/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentPropsWithoutRef, FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: 'Please enter some content',
    })
    .max(1000, {
      message: 'Content cannot be longer than 1000 characters',
    }),
});

type CommentEditFormProps = ComponentPropsWithoutRef<'form'> & {
  postId: string;
  commentId: string;
  commentContent: string;
  onSuccessfulEditComment: (comment: TComment) => void;
};

const CommentEditForm: FC<CommentEditFormProps> = ({
  postId,
  commentId,
  commentContent,
  onSuccessfulEditComment,
  ...props
}) => {
  const { updateComment, commentData, status } = useUpdateComment();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    reset: resetForm,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: commentContent },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateComment({ postId, commentId, content: values.content });
  }

  useEffect(() => {
    if (status === 'success') {
      onSuccessfulEditComment(commentData!);
      resetForm();
    }
  }, [status, resetForm, onSuccessfulEditComment, commentData]);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`mt-2 flex w-full items-center gap-2`}
        {...props}
      >
        <Input
          type="text"
          placeholder="Great post!"
          autoFocus
          {...register('content')}
        />
        <Button
          type="submit"
          variant="secondary"
          disabled={isSubmitting}
          className="h-full"
        >
          <Icons.submit />
          <span className="sr-only">Submit Comment Updates</span>
        </Button>
      </form>
      {errors.content && (
        <p className="ml-2 mt-2 text-sm text-red-500">
          {errors.content.message}
        </p>
      )}
    </div>
  );
};

export default CommentEditForm;
