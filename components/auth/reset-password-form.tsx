'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { ResetSchema } from '@/schemas';

import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';
import { reset } from '@/actions/reset';
import FormItemInput from '../form/form-item-input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { Form, FormField } from '../ui/form';

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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              disabled={isPending}
              render={({ field }) => (
                <FormItemInput
                  label="Email"
                  placeholder="your.email@example.com"
                  type="email"
                  {...field}
                />
              )}
            />
            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Send reset password email'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
