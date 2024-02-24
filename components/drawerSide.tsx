'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './auth/logout-button';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/20/solid';

function DrawerSide() {
  const pathname = usePathname();

  return (
    <div className="p-10">
      <Link href="/">
        <h2 className="text-2xl font-bold">GAZAI.ai (alpha)</h2>
      </Link>
      <ul className="menu w-full min-h-full text-base-content">
        {/* Sidebar content here */}
        <li>
          <Link
            className={clsx({
              active: pathname === '/sketch-to-image'
            })}
            href="/sketch-to-image"
          >
            Sketch to image
          </Link>
        </li>
        <li>
          <Link
            className={clsx({ active: pathname === '/text-to-image' })}
            href="/text-to-image"
          >
            Text to image
          </Link>
        </li>
        <li>
          <LogoutButton>
            <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
            Logout
          </LogoutButton>
        </li>
      </ul>
    </div>
  );
}

export default DrawerSide;
