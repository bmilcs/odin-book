import { FeedContext } from '@/components/services/feed-provider';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import usePost from '@/hooks/usePost';
import { CLIENT_MODE } from '@/utils/env';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useEffect } from 'react';
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

const PostNewForm = ({ className }: { className?: string }) => {
  const { createPost, status } = usePost();
  const { updateFeed } = useContext(FeedContext);

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
            content: 'This is a test post!',
          }
        : {
            content: '',
          },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createPost({ content: values.content });
  }

  useEffect(() => {
    if (status === 'success') {
      reset();
      updateFeed();
    }
  }, [status, reset, updateFeed]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`mx-auto flex w-full max-w-3xl items-center gap-2 ${className}`}
    >
      <Input
        type="post"
        placeholder="I love this app!"
        {...register('content')}
      />
      <Button
        type="submit"
        variant="ghost"
        disabled={isSubmitting}
        className="h-full"
      >
        <Icons.submit />
        <span className="sr-only">Submit Post</span>
      </Button>
    </form>
  );
};

export default PostNewForm;
