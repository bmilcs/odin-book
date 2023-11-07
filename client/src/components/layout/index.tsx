import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto min-h-full max-w-7xl p-4 md:p-10 lg:p-14">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
