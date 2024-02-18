import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/hooks/useAuthContext';
import useCreatePost from '@/hooks/useCreatePost';
import { useFeedContext } from '@/hooks/useFeedContext';
import { CLIENT_MODE } from '@/utils/env';
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

type PostNewFormProps = ComponentPropsWithoutRef<'div'>;

const PostNewForm: FC<PostNewFormProps> = ({ ...props }) => {
  const { addPostToFeed } = useFeedContext();
  const { user } = useAuthContext();
  const {
    createPost,
    postData,
    status,
    reset: resetCreatePostHook,
  } = useCreatePost();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    reset: resetForm,
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
      resetCreatePostHook();
      resetForm();
    }
  }, [status, resetForm, resetCreatePostHook, postData, addPostToFeed]);

  return (
    <div {...props}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex w-full items-center gap-2`}
      >
        <Input
          type="post"
          placeholder={`${user?.username}, what's on your mind?`}
          autoComplete="off"
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
    </div>
  );
};

export default PostNewForm;
