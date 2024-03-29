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
import useLogin from '@/hooks/useLogin';
import { CLIENT_MODE } from '@/utils/env';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentPropsWithoutRef, FC } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

type LoginFormProps = ComponentPropsWithoutRef<'div'>;

const LoginForm: FC<LoginFormProps> = ({ ...props }) => {
  const { error, login, status } = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      CLIENT_MODE === 'development'
        ? {
            email: 'maynard@mjk.com',
            password: 'password1A!',
          }
        : {
            email: '',
            password: '',
          },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    login(values);
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Need an account? <Link to="/signup">Signup here</Link>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormItem>
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
                      <Input
                        type="password"
                        placeholder="**********"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{error}</FormMessage>
                  </FormItem>
                )}
              />
            </FormItem>
            <Button
              className="w-full"
              type="submit"
              disabled={status === 'loading'}
            >
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
