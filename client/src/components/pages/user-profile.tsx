import UserProfile from '@/components/common/user-profile';
import { AuthContext } from '@/components/services/auth-provider';
import { useContext, useEffect } from 'react';

const UserProfilePage = () => {
  const { redirectUnauthenticatedUser } = useContext(AuthContext);

  useEffect(() => {
    redirectUnauthenticatedUser('/login');
  }, [redirectUnauthenticatedUser]);

  return (
    <>
      <UserProfile />
    </>
  );
};

export default UserProfilePage;
