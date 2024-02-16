import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import Main from '@/components/layout/main';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
};

export default Layout;
