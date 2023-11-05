import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl flex-1 p-2 md:p-4">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
