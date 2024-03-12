import NewPasswordForm from '@/components/auth/new-password-form';

export const metadata = {
  title: 'New Password'
};

export default function NewPasswordPage() {
  return (
    <main className="flex items-center justify-center p-20 bg-base-300 min-h-screen">
      <div className="container hidden h-[800px] flex-col items-center justify-center md:grid bg-base-100 overflow-hidden rounded-lg border bg-background shadow-md md:shadow-xl">
        <div className="">
          <NewPasswordForm />
        </div>
      </div>
    </main>
  );
}
