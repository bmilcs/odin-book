import { FeedContext } from '@/components/services/feed-provider';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import usePost from '@/hooks/usePost';
import { CLIENT_MODE } from '@/utils/env';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentPropsWithoutRef, FC, useContext, useEffect } from 'react';
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

type PostNewFormProps = ComponentPropsWithoutRef<'form'>;

const PostNewForm: FC<PostNewFormProps> = ({ ...props }) => {
  const { createPost, postData, status, reset: resetPostHook } = usePost();
  const { addPostToFeed } = useContext(FeedContext);

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
      addPostToFeed(postData!);
      resetPostHook();
      reset();
    }
  }, [status, reset, resetPostHook, postData, addPostToFeed]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex w-full items-center gap-2`}
      {...props}
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
