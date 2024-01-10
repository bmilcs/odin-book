import Layout from '@/components/layout';
import FeedPage from '@/components/pages/feed-page';
import HomePage from '@/components/pages/home-page';
import LoginPage from '@/components/pages/login-page';
import PostPage from '@/components/pages/post-page';
import SignupPage from '@/components/pages/signup-page';
import UserProfilePage from '@/components/pages/user-profile';
import AuthProvider from '@/components/services/auth-provider';
import FeedProvider from '@/components/services/feed-provider';
import NotificationProvider from '@/components/services/notification-provider';
import { ScrollToTop } from '@/components/services/scroll-to-top';
import { ThemeProvider } from '@/components/services/theme-provider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FeedProvider>
          <NotificationProvider>
            <ThemeProvider>
              <Layout>
                <ScrollToTop />
                <Routes>
                  <Route path="/" Component={HomePage} />
                  <Route path="/login" Component={LoginPage} />
                  <Route path="/signup" Component={SignupPage} />
                  <Route path="/feed" Component={FeedPage} />
                  <Route path="/feed" Component={FeedPage} />
                  <Route path="/posts/:postId" Component={PostPage} />
                  <Route path="/users/:username" Component={UserProfilePage} />
                  <Route path="*" Component={FeedPage} />
                </Routes>
              </Layout>
            </ThemeProvider>
          </NotificationProvider>
        </FeedProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
