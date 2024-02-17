import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import useUpdatePost from '@/hooks/useUpdatePost';
import { TPost } from '@/utils/types';
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

type PostEditFormProps = ComponentPropsWithoutRef<'form'> & {
  postId: string;
  postContent: string;
  onSuccessfulEditPost: (post: TPost) => void;
};

const PostEditForm: FC<PostEditFormProps> = ({
  postId,
  postContent,
  onSuccessfulEditPost,
  ...props
}) => {
  const { updatePost, postData, status } = useUpdatePost();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    reset: resetForm,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: postContent },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updatePost({ postId, content: values.content });
  }

  useEffect(() => {
    if (status === 'success') {
      onSuccessfulEditPost(postData!);
      resetForm();
    }
  }, [status, onSuccessfulEditPost, postData, resetForm]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex w-full items-center gap-2`}
        {...props}
      >
        <Input
          type="text"
          placeholder="I love this app!"
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
          <span className="sr-only">Submit Post Updates</span>
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

export default PostEditForm;
