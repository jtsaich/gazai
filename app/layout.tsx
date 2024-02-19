import './globals.css';
import DrawerSide from './components/drawerSide';

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
      <body className="h-full">
        <div className="drawer md:drawer-open">
          <input type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">{children}</div>
          <div className="drawer-side bg-base-200">
            <DrawerSide />
          </div>
        </div>
      </body>
    </html>
  );
}
