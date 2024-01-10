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

const CommentForm = ({
  postId,
  onSuccessfulNewComment,
  className,
}: {
  postId: string;
  onSuccessfulNewComment: () => void;
  className?: string;
}) => {
  const { createComment, status, error } = useComment();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    reset,
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
      onSuccessfulNewComment();
      reset();
    }
  }, [onSuccessfulNewComment, status, reset]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex w-full items-center gap-1  ${className}`}
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

export default CommentForm;
