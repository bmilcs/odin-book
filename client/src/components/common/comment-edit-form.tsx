import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import useComment from '@/hooks/useComment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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

const CommentEditForm = ({
  postId,
  commentId,
  commentContent,
  onSuccess,
  className,
}: {
  postId: string;
  commentId: string;
  commentContent: string;
  onSuccess: () => void;
  className?: string;
}) => {
  const { updateComment, status, error } = useComment();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: commentContent },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateComment({ postId, commentId, content: values.content });
  }

  useEffect(() => {
    if (status === 'success') {
      onSuccess();
    }
  }, [error, status, reset, onSuccess]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex w-full items-center gap-2 ${className}`}
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
    </>
  );
};

export default CommentEditForm;
