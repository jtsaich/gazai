import './globals.css';

export const metadata = {
  title: 'GAZAI.ai (alpha)',
  description: 'ゲーム、Webtoon、VTuber 制作をより安く早く高品質に'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className="h-full">{children}</body>
    </html>
  );
}
