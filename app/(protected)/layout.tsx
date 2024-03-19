import { SessionProvider } from 'next-auth/react';
import { Menu } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { auth } from '@/auth';

import { SidebarNav } from './_components/sidebar-nav';
import { UserNav } from './_components/user-nav';

const sidebarNavItems = [
  {
    title: 'Explore',
    href: '/'
  },
  {
    title: 'Text to image',
    href: '/text-to-image'
  },
  {
    title: 'Image to image',
    href: '/sketch-to-image'
  }
];

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div className="h-screen">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <Sheet>
              <SheetTrigger>
                <div className="flex flex-row gap-2">
                  <Menu /> Gazai
                </div>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Gazai</SheetTitle>
                  <SheetDescription>
                    <SidebarNav items={sidebarNavItems} />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
        <div className="h-[calc(100vh-theme(space.16)-1px)]">{children}</div>
      </div>
    </SessionProvider>
  );
}
