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
import { ExpressValidatorError } from '@/types/api';
import { API_BASE_URL, CLIENT_MODE } from '@/utils/env';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

type ApiResponse = {
  message: string;
  success: boolean;
  data?: string;
  error?: ExpressValidatorError[];
};

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
  const [apiErrors, setApiErrors] = useState<ExpressValidatorError[]>([]);
  const navigate = useNavigate();

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

  const mutation = useMutation((values: z.infer<typeof formSchema>) =>
    fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(values),
    }).then((res) => res.json()),
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values, {
      onSuccess: (data: ApiResponse) => {
        if (data.success) {
          navigate('/feed');
          return;
        }
        setApiErrors(data.error || []);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  }

  const getFieldErrorMsg = (errors: ExpressValidatorError[], field: string) => {
    return errors.reduce((acc: string, cur: ExpressValidatorError) => {
      return cur.path === field ? cur.msg : acc;
    }, '');
  };

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
                      {getFieldErrorMsg(apiErrors, 'username')}
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
                      {getFieldErrorMsg(apiErrors, 'email')}
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
                      {getFieldErrorMsg(apiErrors, 'password')}
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
                      {getFieldErrorMsg(apiErrors, 'confirmPassword')}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </FormItem>
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
