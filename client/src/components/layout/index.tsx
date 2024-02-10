import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import Main from '@/components/layout/main';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  );
};

export default Layout;
