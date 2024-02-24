import LogoutButton from '@/components/auth/logout-button';
import { auth, signIn, signOut } from '../auth';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/20/solid';

export default async function IndexPage() {
  // const session = await auth();
  // if (!session?.user) {
  //   return (
  //     <main className="p-10">
  //       <form
  //         action={async () => {
  //           'use server';
  //           await signIn('google');
  //         }}
  //       >
  //         <button className="btn btn-primary">Sign in with Google</button>
  //       </form>
  //     </main>
  //   );
  // }

  return (
    <main className="p-10">
      <LogoutButton>
        <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
        Logout
      </LogoutButton>
    </main>
  );
}
