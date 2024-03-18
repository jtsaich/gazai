'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GrGoogle } from 'react-icons/gr';

import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

import { Button } from '../ui/button';

const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button className="w-full" onClick={() => onClick('google')}>
        <GrGoogle className="mr-2" /> Login with Google
      </Button>
    </div>
  );
};

export default Social;
