'use client';

import { setAsAdmin } from '@/actions/admin';
import { Button } from './ui/button';

function SetAsAdminButton({ userId }: { userId: string }) {
  return (
    <Button
      onClick={async () => {
        setAsAdmin(userId);
      }}
    >
      Set as Admin
    </Button>
  );
}

export default SetAsAdminButton;
