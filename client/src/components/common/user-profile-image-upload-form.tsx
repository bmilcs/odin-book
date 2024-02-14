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
import useProfileImageUpload from '@/hooks/useProfileImageUpload';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentPropsWithoutRef, FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type UserProfileImageUploadFormProps = ComponentPropsWithoutRef<'div'> & {
  className?: string;
  onClose: () => void;
};

const formSchema = z.object({
  file: z.custom<File>((v) => v instanceof File, {
    message: 'Image is required',
  }),
});

const UserProfileImageUploadForm: FC<UserProfileImageUploadFormProps> = ({
  className = '',
  onClose,
  ...props
}) => {
  const { updateProfileImage, status, error } = useProfileImageUpload();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('file', values.file);
    updateProfileImage(formData);
  };

  useEffect(() => {
    if (status === 'success') {
      form.reset();
      onClose();
    }
  }, [status, form, onClose]);

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10 dark:bg-black dark:bg-opacity-20">
      <Card className={`relative max-w-4xl ${className}`} {...props}>
        <CardHeader>
          <Button
            className="absolute right-4 top-4 h-6 w-6 p-0"
            onClick={handleClose}
          >
            <Icons.close />
            <span className="sr-only">Close</span>
          </Button>
          <CardTitle>Upload Profile Image</CardTitle>
          <CardDescription>Select a new image for your profile</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange }, ...field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Images</FormLabel>
                      {/* File Upload */}
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple={false}
                          disabled={form.formState.isSubmitting}
                          {...field}
                          onChange={(event) => {
                            // Check if a file is selected
                            if (event.target.files && event.target.files[0]) {
                              // Pass the selected file directly to the onChange function
                              onChange(event.target.files[0]);
                            } else {
                              // If no file is selected, set the value to undefined
                              onChange(undefined);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage>{error}</FormMessage>
                    </FormItem>
                  );
                }}
              />

              <Button
                className="w-full"
                type="submit"
                disabled={status === 'loading'}
              >
                Upload Profile Image
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileImageUploadForm;
