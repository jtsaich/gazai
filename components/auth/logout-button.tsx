'use client';

import { logout } from '@/actions/logout';
import { useToggle } from '@uidotdev/usehooks';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

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
