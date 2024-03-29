'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { login } from '@/actions/login';
import { LoginSchema } from '@/schemas';
import { useIsClient } from '@/hooks/use-is-client';

import FormError from '../form-error';
import FormSuccess from '../form-success';
import FormItemInput from '../form/form-item-input';
import Spinner from '../spinner';
import { Button, buttonVariants } from '../ui/button';
import { Form, FormField } from '../ui/form';

import Social from './social';

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with a different provider!'
      : '';

  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [isPending, startTransition] = useTransition();

  const isClient = useIsClient();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      code: ''
    }
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      try {
        login(values, callbackUrl).then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        });
      } catch (err) {
        setError(`Something went wrong! Error:${err}`);
      } finally {
        setShowTwoFactor(false);
        setSuccess('');
        setError('');
      }
    });
  };

  if (!isClient) return <Spinner />;

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-y-6 sm:w-[350px]">
      <div className="flex flex-col gap-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
      </div>
      <div className="grid gap-6"></div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-6"
        >
          <div className="flex flex-col gap-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                disabled={isPending}
                render={(field) => (
                  <FormItemInput
                    label="Two Factor Authentication Code"
                    placeholder="123456"
                    autoComplete="one-time-code"
                    {...field}
                  />
                )}
              />
            )}
            {!showTwoFactor && (
              <>
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
                      disabled={isPending}
                      type="password"
                      placeholder="your.email@example.com"
                      autoComplete="current-password"
                      {...field}
                    />
                  )}
                />
                <Link
                  href="/auth/reset"
                  className={buttonVariants({ variant: 'link' })}
                >
                  Forgot your password?
                </Link>
              </>
            )}
          </div>
          {error && <FormError message={error || urlError} />}
          {success && <FormSuccess message={success} />}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : showTwoFactor ? (
              'Confirm'
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Social />

      <div className="text-center">
        Need an account?{' '}
        <Link
          href="/auth/register"
          className={buttonVariants({ variant: 'link' })}
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
