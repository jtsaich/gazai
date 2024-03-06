import { cache } from 'react';
import { auth } from '../../../auth';
import SetAsAdminButton from '../../../components/setAsAdminButton';
import prisma from '@/lib/prisma';
import RoleGate from '@/components/auth/role-gate';
import { UserRole } from '@prisma/client';

const getUsers = cache(async () => {
  const users = await prisma.user.findMany();
  return users;
});
export default async function Admin() {
  const users = await getUsers();
  return (
    <RoleGate allowedRole={UserRole.ADMIN}>
      <main className="p-10">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <SetAsAdminButton userId={user.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </RoleGate>
  );
}
