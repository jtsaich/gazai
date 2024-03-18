'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useIsClient } from '@/hooks/use-is-client';
import Spinner from '../spinner';
import { RegisterSchema } from '@/schemas';
import FormError from '../form-error';
import FormSuccess from '../form-success';
import { register } from '@/actions/register';
import FormItemInput from '@/components/form/form-item-input';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { Form, FormField } from '../ui/form';

const RegisterForm = () => {
  const isClient = useIsClient();

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    }
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      register(values).then((data) => {
        if (data.success) setSuccess(data.success);
        if (data?.error) setError(data.error);
      });
    });

    form.reset();
    setSuccess('');
    setError('');
  };

  if (!isClient) return <Spinner />;

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-y-6 sm:w-[350px]">
      <div className="flex flex-col gap-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-6"
          >
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                disabled={isPending}
                render={(field) => (
                  <FormItemInput
                    label="Name"
                    placeholder="Your Name"
                    {...field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="email"
                disabled={isPending}
                render={(field) => (
                  <FormItemInput
                    label="Email"
                    type="email"
                    placeholder="your.email@example.com"
                    autoComplete="email"
                    {...field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="password"
                disabled={isPending}
                render={(field) => (
                  <FormItemInput
                    label="Password"
                    type="password"
                    placeholder="******"
                    autoComplete="new-password"
                    {...field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="passwordConfirmation"
                disabled={isPending}
                render={(field) => (
                  <FormItemInput
                    label="Confirm your password"
                    type="password"
                    placeholder="******"
                    autoComplete="new-password"
                    {...field}
                  />
                )}
              />
            </div>
            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Register'
              )}
            </Button>

            <div className="text-center">
              Already have an account?{' '}
              <Link href="/auth/login" className="link">
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
