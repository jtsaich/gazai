import { cache } from 'react';
import { auth } from '../../../auth';
import SetAsAdminButton from '../../../components/setAsAdminButton';
import prisma from '@/lib/prisma';

const getUsers = cache(async () => {
  const users = await prisma.user.findMany();
  return users;
});
export default async function Admin() {
  const session = await auth();
  if (!session?.user) {
    return <div className="p-10">Please login first</div>;
  }

  const user = session.user;
  if (user.role !== 'ADMIN') {
    return <div className="p-10">Access Denied</div>;
  }

  const users = await getUsers();
  return (
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
  );
}
