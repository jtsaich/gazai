'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { ResetSchema } from '@/schemas';

import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';
import { reset } from '@/actions/reset';
import Input from '../form/input';

const ResetPasswordForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      reset(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-y-6 sm:w-[350px]">
      <div className="flex flex-col gap-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Set a new password
        </h1>
      </div>
      <div className="grid gap-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-6"
        >
          <Input
            label="Email"
            disabled={isPending}
            placeholder="your.email@example.com"
            type="email"
            {...form.register('email')}
          />
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}
          <button
            disabled={isPending}
            type="submit"
            className="btn btn-primary w-full"
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner"></span>
                loading
              </>
            ) : (
              'Send reset password email'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
