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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useUserProfile from '@/hooks/useUserProfile';
import { getFieldErrorMsg } from '@/utils/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentPropsWithoutRef, FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type TProfile = {
  username: string;
  email: string;
  _id: string;
  profile: {
    bio: string;
    location: string;
  };
};

type UserProfileUpdateFormProps = ComponentPropsWithoutRef<'div'> & {
  data: TProfile;
};

const formSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email.',
  }),
  bio: z.string().max(500, {
    message: 'Bio must be under 500 characters.',
  }),
  location: z.string().max(150, {
    message: 'Location must be under 150 characters.',
  }),
});

const UserProfileUpdateForm: FC<UserProfileUpdateFormProps> = ({
  data,
  ...props
}) => {
  const { updateUserProfile, validationErrors, status, error } =
    useUserProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: data.username,
      email: data.email,
      bio: data.profile.bio,
      location: data.profile.location,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateUserProfile({
      username: values.username,
      email: values.email,
      bio: values.bio,
      location: values.location,
    });
  };

  useEffect(() => {
    if (status === 'success') {
      form.reset();
    }
  }, [status, form]);

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
        <CardDescription>
          Change your username, email, bio or location.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormItem>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="CoolGuy"
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {getFieldErrorMsg(validationErrors, 'username')}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="coolguy@gmail.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {getFieldErrorMsg(validationErrors, 'email')}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="New England, USA"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {getFieldErrorMsg(validationErrors, 'location')}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Tell us about yourself!"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {getFieldErrorMsg(validationErrors, 'bio')}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </FormItem>

            <FormMessage>{error}</FormMessage>

            <Button
              className="w-full"
              type="submit"
              disabled={status === 'loading'}
            >
              Update Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserProfileUpdateForm;
