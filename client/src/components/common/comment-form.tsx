import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import useNewComment from '@/hooks/useNewComment';
import { CLIENT_MODE } from '@/utils/env';
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
  className,
}: {
  postId: string;
  className?: string;
}) => {
  const { error, submitComment, status } = useNewComment({ postId });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      CLIENT_MODE === 'development'
        ? {
            content: 'This is a test comment!',
          }
        : {
            content: '',
          },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitComment(values);
  }

  useEffect(() => {
    if (status === 'success') {
      reset();
    }
  }, [error, status, reset]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex w-full items-center gap-2 ${className}`}
    >
      <Input type="post" className="bg-border" {...register('content')} />
      <Button
        type="submit"
        disabled={isSubmitting}
        variant="secondary"
        className="h-full"
      >
        <Icons.submit />
        <span className="sr-only">Submit Comment</span>
      </Button>
    </form>
  );
};

export default CommentForm;
