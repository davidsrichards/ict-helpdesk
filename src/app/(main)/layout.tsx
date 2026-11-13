import NavBar from '@/components/layout/NavBar';
import { APP_NAME, INSTITUTION_NAME } from '@/components/brand/BrandLogo';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main id="main" className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:px-6">
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} {INSTITUTION_NAME} &middot; {APP_NAME}
      </footer>
    </>
  );
}
