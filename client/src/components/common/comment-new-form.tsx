import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { TComment } from '@/context/feed-provider';
import useCreateComment from '@/hooks/useCreateComment';
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

type CommentNewFormProps = ComponentPropsWithoutRef<'form'> & {
  postId: string;
  onSuccessfulNewComment: (commentData: TComment) => void;
};

const CommentNewForm: FC<CommentNewFormProps> = ({
  postId,
  onSuccessfulNewComment,
  ...props
}) => {
  const {
    createComment,
    commentData,
    reset: resetCreateCommentHook,
    status,
    error,
  } = useCreateComment();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    reset: resetForm,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createComment({ postId, content: values.content });
  }

  useEffect(() => {
    if (status === 'success') {
      onSuccessfulNewComment(commentData!);
      resetCreateCommentHook();
      resetForm();
    }
  }, [
    onSuccessfulNewComment,
    resetCreateCommentHook,
    commentData,
    status,
    resetForm,
  ]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex w-full items-center gap-1`}
      {...props}
    >
      <Input
        type="post"
        {...register('content')}
        placeholder="Add a comment..."
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        variant="ghost"
        className="h-full"
      >
        <Icons.submit />
        <span className="sr-only">Submit Comment</span>
      </Button>
    </form>
  );
};

export default CommentNewForm;
