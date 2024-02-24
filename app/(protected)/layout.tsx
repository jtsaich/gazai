import { SessionProvider } from 'next-auth/react';

import { auth } from '@/auth';
import DrawerSide from '../../components/drawerSide';

export const metadata = {
  title: 'Protected Routes'
};

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="drawer md:drawer-open">
        <input type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">{children}</div>
        <div className="drawer-side bg-base-200">
          <DrawerSide />
        </div>
      </div>
    </SessionProvider>
  );
}
