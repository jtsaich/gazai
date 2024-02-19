import { auth } from '../../auth';
import TextToImageForm from '../components/textToImageForm';
import { SessionUserWithRole } from '../types';

export default async function TextToImage() {
  const session = await auth();
  if (!session?.user) {
    return <div className="p-10">Please login first</div>;
  }

  const user: SessionUserWithRole = session.user;

  if (user.role !== 'ADMIN') {
    return <div className="p-10">Access Denied</div>;
  }

  // 出力画像サイズ output image size (1-4, 1024, 768, 512)
  // <input type="range" min={0} max="100" value="40" className="range" />

  // プロンプト prompt
  // prompt

  // プロンプト カテゴリー
  // プロンプト グループ
  // プロンプト タグ

  return (
    <main className="p-10">
      <TextToImageForm />
    </main>
  );
}
