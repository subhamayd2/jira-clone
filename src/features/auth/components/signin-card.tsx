'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import z from 'zod';
import DottedSeparator from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Form, FormControl, FormField, FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useLogin from '@/features/auth/api/use-login';
import { loginSchema } from '@/features/auth/schemas';

function SignInCard() {
  const router = useRouter();
  const { mutateAsync, isPending } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    await mutateAsync({ json: values });
    router.replace('/');
  };

  return (
      <Card className="w-full h-full md:w-[487px] border-none shadow-none">
          <CardHeader className="flex items-center justify-center text-center p-7">
              <CardTitle className="text-2xl">
                  Welcome back!
              </CardTitle>
          </CardHeader>
          <div className="px-7">
              <DottedSeparator />
          </div>
          <CardContent className="p-7">
              <Form {...form}>
                  <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                          name="email"
                          control={form.control}
                          render={({ field }) => (
                              <FormItem>
                                  <FormControl>
                                      <Input
                                          {...field}
                                          placeholder="Enter email"
                                          type="email"
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          name="password"
                          control={form.control}
                          render={({ field }) => (
                              <FormItem>
                                  <FormControl>
                                      <Input
                                          {...field}
                                          placeholder="Enter password"
                                          type="password"
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <Button size="lg" className="w-full" loading={isPending}>Login</Button>
                  </form>
              </Form>
          </CardContent>
          <div className="px-7">
              <DottedSeparator />
          </div>
          <CardContent className="p-7 flex flex-col gap-y-4">
              <Button variant="secondary" size="lg" className="w-full" disabled={isPending} icon={<FcGoogle className="mr-2 size-5" />}>
                  Login with Google
              </Button>
              <Button variant="secondary" size="lg" className="w-full" disabled={isPending} icon={<FaGithub className="mr-2 size-5" />}>
                  Login with Github
              </Button>
          </CardContent>
          <div className="px-7">
              <DottedSeparator />
          </div>
          <CardContent className="p-7 flex items-center justify-center">
              <p>Don&apos;t have an account?&nbsp;
                  <Link href="/sign-up">
                      <span className="text-blue-700">Sign up</span>
                  </Link>
              </p>
          </CardContent>
      </Card>
  );
}

export default SignInCard;
