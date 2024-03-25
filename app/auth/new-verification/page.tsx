import { Suspense } from 'react';

import NewVerificationForm from '@/components/auth/new-verification-form';

export const metadata = {
  title: 'Verification'
};

export default function NewVerificationPage() {
  return (
    <main className="flex items-center justify-center p-20 bg-base-300 min-h-screen">
      <div className="container hidden h-[800px] flex-col items-center justify-center md:grid bg-base-100 overflow-hidden rounded-lg border bg-background shadow-md md:shadow-xl">
        <div className="">
          <Suspense fallback={<div>Loading...</div>}>
            <NewVerificationForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
