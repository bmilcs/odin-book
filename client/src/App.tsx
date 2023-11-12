import Layout from '@/components/layout';
import Home from '@/components/pages/home';
import Login from '@/components/pages/login';
import Signup from '@/components/pages/signup';
import AuthProvider from '@/components/services/auth-provider';
import { ScrollToTop } from '@/components/services/scroll-to-top';
import { ThemeProvider } from '@/components/services/theme-provider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Layout>
            <ScrollToTop />
            <Routes>
              <Route path="/" Component={Home} />
              <Route path="/login" Component={Login} />
              <Route path="/signup" Component={Signup} />
            </Routes>
          </Layout>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
