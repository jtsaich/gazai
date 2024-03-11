'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useIsClient } from '@/hooks/use-is-client';
import Spinner from '../spinner';
import { RegisterSchema } from '@/schemas';
import FormError from '../form/form-error';
import FormSuccess from '../form/form-success';
import { register } from '@/actions/register';
import Input from '@/components/form/input';

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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-6"
        >
          <div className="flex flex-col gap-y-4">
            <Input
              label="Name"
              disabled={isPending}
              placeholder="Your Name"
              {...form.register('name')}
            />
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
              placeholder="******"
              autoComplete="new-password"
              {...form.register('password')}
            />
            <Input
              label="Confirm your password"
              disabled={isPending}
              type="password"
              placeholder="******"
              autoComplete="new-password"
              {...form.register('passwordConfirmation')}
            />
          </div>
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary w-full"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
