'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GrGoogle } from 'react-icons/gr';

import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <button className="btn w-full" onClick={() => onClick('google')}>
        <GrGoogle />
      </button>
    </div>
  );
};

export default Social;
