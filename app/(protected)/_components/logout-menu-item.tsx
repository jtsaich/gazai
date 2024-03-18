'use client';

import { useToggle } from '@uidotdev/usehooks';
import { Loader2 } from 'lucide-react';

import { logout } from '@/actions/logout';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

const LogoutMenuItem = () => {
  const [loggingOut, toggleLoggingOut] = useToggle(false);
  const handleLogout = () => {
    toggleLoggingOut();
    logout();
    toggleLoggingOut();
  };

  return (
    <DropdownMenuItem onClick={handleLogout}>
      {loggingOut ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        'Logout'
      )}
    </DropdownMenuItem>
  );
};

export default LogoutMenuItem;
