import { auth } from '../../auth';
import ImageToImageForm from '../components/imageToImageForm';
import { SessionUserWithRole } from '../types';

export default async function SketchToImage() {
  const session = await auth();
  if (!session?.user) {
    return <div className="p-10">Please login first</div>;
  }

  const user: SessionUserWithRole = session.user;

  if (user.role !== 'ADMIN') {
    return <div className="p-10">Access Denied</div>;
  }

  return (
    <main className="p-10">
      <ImageToImageForm />
    </main>
  );
}
