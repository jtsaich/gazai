import RegisterForm from '@/components/auth/register-form';

export const metadata = {
  title: 'Register'
};
export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center p-20 bg-base-300 min-h-screen">
      <div className="container hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-base-100 overflow-hidden rounded-lg border bg-background shadow-md md:shadow-xl">
        <figure className="hidden h-full flex-col lg:flex dark:border-r bg-base-200"></figure>
        <div className="lg:p-8">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
