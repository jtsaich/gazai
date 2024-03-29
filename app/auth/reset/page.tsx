import ResetPasswordForm from '@/components/auth/reset-password-form';

export const metadata = {
  title: 'Reset Password'
};

export default function ResetPasswordPage() {
  return (
    <main className="flex items-center justify-center p-20 bg-base-300 min-h-screen">
      <div className="container hidden h-[800px] flex-col items-center justify-center md:grid bg-base-100 overflow-hidden rounded-lg border bg-background shadow-md md:shadow-xl">
        <div className="">
          <ResetPasswordForm />
        </div>
      </div>
    </main>
  );
}
