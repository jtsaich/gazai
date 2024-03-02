'use client';

import { logout } from '@/actions/logout';
import { cn } from '@/lib/utils';
import { useToggle } from '@uidotdev/usehooks';

const LogoutButton = ({ children }: { children: React.ReactNode }) => {
  const [loggingOut, toggleLoggingOut] = useToggle(false);
  const handleLogout = () => {
    toggleLoggingOut();
    logout();
    toggleLoggingOut();
  };

  return (
    <button
      onClick={handleLogout}
      className={cn('btn btn-secondary', {
        'btn-disabled': loggingOut
      })}
      disabled={loggingOut}
    >
      {loggingOut ? (
        <>
          <span className="loading loading-spinner"></span> loading
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LogoutButton;
