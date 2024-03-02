import LogoutButton from '@/components/auth/logout-button';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/20/solid';

import Link from 'next/link';

export default async function IndexPage() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-4">Start making art!</h1>

      <div className="flex overflow-hidden rounded-md gap-4">
        <Link className="btn btn-primary" href="/text-to-image">
          Image Generation
        </Link>
        <Link className="btn btn-primary" href="/sketch-to-image">
          Magic Paint
        </Link>
        <LogoutButton>
          <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
          Logout
        </LogoutButton>
      </div>
    </main>
  );
}
