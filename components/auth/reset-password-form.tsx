'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { ResetSchema } from '@/schemas';

import FormError from '@/components/form/form-error';
import FormSuccess from '@/components/form/form-success';
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Email"
          disabled={isPending}
          placeholder="your.email@example.com"
          type="email"
          {...form.register('email')}
        />
      </div>
      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}
      <button
        disabled={isPending}
        type="submit"
        className="btn btn-primary w-full"
      >
        Send reset password email
      </button>
    </form>
  );
};

export default ResetPasswordForm;
