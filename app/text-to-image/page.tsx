import { User } from 'next-auth';
import { auth } from '../../auth';
import TextToImageForm from '../components/textToImageForm';
import { SessionUserWithRole } from '../types';

export default async function TextToImage() {
  const session = await auth();
  if (!session?.user) {
    return <div>Please login first</div>;
  }

  const user: SessionUserWithRole = session.user;

  if (user.role !== 'ADMIN') {
    return <div>Access Denied</div>;
  }

  // const { data: session, status } = useSession();
  // console.log(session);

  // japan prompt input

  // cfg
  // 出力画像サイズ output image size (1-4, 1024, 768, 512)
  // <input type="range" min={0} max="100" value="40" className="range" />

  // Characters / Clothes

  // プロンプト prompt
  // prompt

  // プロンプト カテゴリー
  // プロンプト グループ
  // プロンプト タグ

  // negative prompt

  // if (status === 'loading') {
  //   return <p>Loading...</p>;
  // }

  // if (status === 'unauthenticated') {
  //   return <p>Access Denied</p>;
  // }

  return (
    <main className="p-10">
      <TextToImageForm />
    </main>
  );
}
