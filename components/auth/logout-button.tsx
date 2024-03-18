'use client';

import { useToggle } from '@uidotdev/usehooks';
import { Loader2 } from 'lucide-react';

import { logout } from '@/actions/logout';

import { Button } from '../ui/button';

const LogoutButton = ({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const [loggingOut, toggleLoggingOut] = useToggle(false);
  const handleLogout = () => {
    toggleLoggingOut();
    logout();
    toggleLoggingOut();
  };

  return (
    <Button
      onClick={handleLogout}
      variant={'secondary'}
      disabled={loggingOut}
      className={className}
    >
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
