'use client';

import { setAsAdmin } from '@/actions/admin';

function SetAsAdminButton({ userId }: { userId: string }) {
  return (
    <button
      className="btn btn-primary"
      onClick={async () => {
        setAsAdmin(userId);
      }}
    >
      Set as Admin
    </button>
  );
}

export default SetAsAdminButton;
