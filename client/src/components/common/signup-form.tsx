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
import useSignup from '@/hooks/useSignup';
import { CLIENT_MODE } from '@/utils/env';
import { getFieldErrorMsg } from '@/utils/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  confirmPassword: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

const SignupForm = ({ className }: { className?: string }) => {
  const { error, signup, status } = useSignup();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      CLIENT_MODE === 'development'
        ? {
            username: 'Maynard',
            email: 'maynard@mjk.com',
            password: 'password1A!',
            confirmPassword: 'password1A!',
          }
        : {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
          },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signup(values);
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>
          Already have an account? <Link to="/login">Login here</Link>.
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
                      <Input placeholder="CoolGuy" {...field} />
                    </FormControl>
                    <FormMessage>
                      {getFieldErrorMsg(error, 'username')}
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
                      <Input placeholder="coolguy@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage>
                      {getFieldErrorMsg(error, 'email')}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage>
                      {getFieldErrorMsg(error, 'password')}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage>
                      {getFieldErrorMsg(error, 'confirmPassword')}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </FormItem>
            <Button
              className="w-full"
              type="submit"
              disabled={status === 'loading'}
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
