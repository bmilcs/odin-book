import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import useNewPost from '@/hooks/useNewPost';
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

const PostNewForm = ({ className }: { className?: string }) => {
  const { error, submitPost, status } = useNewPost();

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
    submitPost(values);
  }

  useEffect(() => {
    if (status === 'success') {
      reset();
    }
  }, [error, status, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`mx-auto flex w-full max-w-5xl items-center gap-2 ${className}`}
    >
      <Input
        type="post"
        placeholder="I love this app!"
        className="bg-border"
        {...register('content')}
      />
      <Button
        type="submit"
        variant="secondary"
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
