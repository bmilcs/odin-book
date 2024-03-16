import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthContext } from '@/hooks/useAuthContext';
import useCreatePost from '@/hooks/useCreatePost';
import { useFeedContext } from '@/hooks/useFeedContext';
import { CLIENT_MODE } from '@/utils/env';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentPropsWithoutRef, FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type PostNewFormProps = ComponentPropsWithoutRef<'div'>;

const PostNewForm: FC<PostNewFormProps> = ({ className = '', ...props }) => {
  const { user } = useAuthContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleTogglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  return (
    <Card {...props} className={` ${className}`}>
      <Button
        onClick={() => setIsPopupOpen((prev) => !prev)}
        className="h-full w-full text-lg font-bold"
      >
        Hey {user?.username}, what is on your mind?
        <span className="sr-only">Create New Post</span>
      </Button>
      {isPopupOpen && <PostNewFormPopup onClose={handleTogglePopup} />}
    </Card>
  );
};

const formSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: 'Please enter some content',
    })
    .max(1000, {
      message: 'Content cannot be longer than 1000 characters',
    }),
  file: z.custom<File | null>((v) => v instanceof File || v === null, {
    message: 'An image type is required',
  }),
});

type PostNewFormPopupProps = ComponentPropsWithoutRef<'div'> & {
  onClose: () => void;
};

const PostNewFormPopup: FC<PostNewFormPopupProps> = ({ onClose, ...props }) => {
  const { addPostToFeed } = useFeedContext();
  const {
    createPost,
    postData,
    status,
    reset: resetCreatePostHook,
  } = useCreatePost();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: CLIENT_MODE === 'development' ? 'This is a test post!' : '',
      file: null,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append('content', values.content);
    if (values.file) {
      formData.append('file', values.file);
    }
    createPost(formData);
  }

  useEffect(() => {
    if (status === 'success') {
      addPostToFeed(postData!);
      resetCreatePostHook();
      form.reset();
      onClose();
    }
  }, [status, form, resetCreatePostHook, postData, addPostToFeed, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 dark:bg-black dark:bg-opacity-30">
      <Card className={`relative w-[90%] sm:w-96`} {...props}>
        <CardHeader>
          <Button
            className="absolute right-4 top-4 h-6 w-6 p-0"
            onClick={onClose}
          >
            <Icons.close />
            <span className="sr-only">Close</span>
          </Button>
          <CardTitle>Create Post</CardTitle>
          <CardDescription>What is on your mind?</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Your Post</FormLabel>
                      <FormControl>
                        <Textarea
                          autoFocus
                          rows={5}
                          disabled={form.formState.isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.content?.message}
                      </FormMessage>
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange }, ...field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      {/* File Upload */}
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple={false}
                          disabled={form.formState.isSubmitting}
                          onChange={(event) => {
                            // Check if a file is selected
                            if (event.target.files && event.target.files[0]) {
                              // Pass the selected file directly to the onChange function
                              onChange(event.target.files[0]);
                            } else {
                              // If no file is selected, set the value to null
                              onChange(null);
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.file?.message}
                      </FormMessage>
                    </FormItem>
                  );
                }}
              />

              <Button
                className="w-full"
                type="submit"
                disabled={status === 'loading'}
              >
                Create Post
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostNewForm;
