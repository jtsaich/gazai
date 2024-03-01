'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { useIsClient } from '@/hooks/use-is-client';
import { LoginSchema } from '@/schemas';

import FormError from '../form/form-error';
import FormSuccess from '../form/form-success';
import { login } from '@/actions/login';
import Input from '../form/input';
import Spinner from '../spinner';
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-6"
      >
        <div className="flex flex-col gap-y-4">
          {showTwoFactor && (
            <Input
              label="Two Factor Authentication Code"
              disabled={isPending}
              placeholder="123456"
              autoComplete="one-time-code"
              {...form.register('code')}
            />
          )}
          {!showTwoFactor && (
            <>
              <Input
                label="Email"
                disabled={isPending}
                type="email"
                placeholder="your.email@example.com"
                autoComplete="email"
                {...form.register('email')}
              />
              <Input
                label="Password"
                disabled={isPending}
                type="password"
                placeholder="your.email@example.com"
                autoComplete="current-password"
                {...form.register('password')}
              />
              <Link href="/auth/reset">Forgot your password?</Link>
            </>
          )}
        </div>
        {error && <FormError message={error || urlError} />}
        {success && <FormSuccess message={success} />}
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary w-full"
        >
          {showTwoFactor ? 'Confirm' : 'Login'}
        </button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-base-100 px-2">Or continue with</span>
        </div>
      </div>

      <Social />
    </div>
  );
};

export default LoginForm;
