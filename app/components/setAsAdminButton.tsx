'use client';

import { setAsAdmin } from '../actions';

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
