'use client';

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import DottedSepartor from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form, FormControl, FormField, FormItem,
  FormMessage,
} from '@/components/ui/form';
import { signUpSchema } from '@/features/auth/schemas';
import useSignup from '@/features/auth/api/use-signup';

function SignUpCard() {
  const { mutate, isPending } = useSignup();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    mutate({ json: values });
  };

  return (
      <Card className="w-full h-full md:w-[487px] border-none shadow-none">
          <CardHeader className="flex items-center justify-center text-center p-7">
              <CardTitle className="text-2xl">
                  Sign up
              </CardTitle>
              <CardDescription>
                  Get started with your free account.
              </CardDescription>
          </CardHeader>
          <div className="px-7">
              <DottedSepartor />
          </div>
          <CardContent className="p-7">
              <Form {...form}>
                  <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                          name="name"
                          control={form.control}
                          render={({ field }) => (
                              <FormItem>
                                  <FormControl>
                                      <Input
                                          {...field}
                                          placeholder="Enter your name"
                                          type="text"
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
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
                      <Button size="lg" className="w-full" loading={isPending}>Sign up</Button>
                  </form>
              </Form>
          </CardContent>
          <div className="px-7">
              <DottedSepartor />
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
              <DottedSepartor />
          </div>
          <CardContent className="p-7 flex items-center justify-center">
              <p>Already have an account?&nbsp;
                  <Link href="/sign-in">
                      <span className="text-blue-700">Login</span>
                  </Link>
              </p>
          </CardContent>
      </Card>
  );
}

export default SignUpCard;
