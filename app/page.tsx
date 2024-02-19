import { auth, signIn, signOut } from '../auth';

export default async function IndexPage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <main className="p-10">
        <form
          action={async () => {
            'use server';
            await signIn('google');
          }}
        >
          <button className="btn btn-primary">Sign in with Google</button>
        </form>
      </main>
    );
  }

  return (
    <main className="p-10">
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <button className="btn btn-primary">Sign out</button>
      </form>
    </main>
  );
}
