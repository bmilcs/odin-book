import ProtectedRoute from '@/components/common/protected-route';
import Layout from '@/components/layout';
import EditProfilePage from '@/components/pages/edit-profile';
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
                  <Route
                    path="/feed"
                    element={
                      <ProtectedRoute>
                        <FeedPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/posts/:postId"
                    element={
                      <ProtectedRoute>
                        <PostPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/users/:username"
                    element={
                      <ProtectedRoute>
                        <UserProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-profile"
                    element={
                      <ProtectedRoute>
                        <EditProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <ProtectedRoute>
                        <FeedPage />
                      </ProtectedRoute>
                    }
                  />
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
