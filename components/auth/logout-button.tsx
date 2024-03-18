'use client';

import { logout } from '@/actions/logout';
import { cn } from '@/lib/utils';
import { useToggle } from '@uidotdev/usehooks';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

const LogoutButton = ({ children }: { children: React.ReactNode }) => {
  const [loggingOut, toggleLoggingOut] = useToggle(false);
  const handleLogout = () => {
    toggleLoggingOut();
    logout();
    toggleLoggingOut();
  };

  return (
    <Button onClick={handleLogout} variant={'secondary'} disabled={loggingOut}>
      {loggingOut ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default LogoutButton;
