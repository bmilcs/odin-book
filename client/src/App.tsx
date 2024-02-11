import ProtectedRoute from '@/components/common/protected-route';
import { ScrollToTop } from '@/components/common/scroll-to-top';
import Layout from '@/components/layout';
import AuthProvider from '@/context/auth-provider';
import FeedProvider from '@/context/feed-provider';
import NotificationProvider from '@/context/notification-provider';
import ThemeProvider from '@/context/theme-provider';
import EditProfilePage from '@/pages/edit-profile';
import FeedPage from '@/pages/feed-page';
import HomePage from '@/pages/home-page';
import LoginPage from '@/pages/login-page';
import PostPage from '@/pages/post-page';
import SignupPage from '@/pages/signup-page';
import UserProfilePage from '@/pages/user-profile';
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
