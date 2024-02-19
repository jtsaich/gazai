import { signIn } from '../auth';

export default async function IndexPage() {
  return (
    <main>
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
