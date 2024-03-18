'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { NewPasswordSchema } from '@/schemas';
import { Form } from '@/components/ui/form';
import { newPassword } from '@/actions/new-password';
import { Button } from '@/components/ui/button';
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';
import FormItemInput from '../form/form-item-input';
import { Loader2 } from 'lucide-react';

const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirmation: ''
    }
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });

    form.reset();
    setSuccess('');
    setError('');
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
            <FormItemInput
              label="Password"
              disabled={isPending}
              type="password"
              placeholder="******"
              autoComplete="new-password"
              {...form.register('password')}
            />
            <FormItemInput
              label="Confirm your password"
              disabled={isPending}
              type="password"
              placeholder="******"
              autoComplete="new-password"
              {...form.register('passwordConfirmation')}
            />
            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Reset password'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewPasswordForm;
