import { AuthContext } from '@/components/services/auth-provider';
import useUserProfile from '@/hooks/useUserProfile';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { username } = useParams();
  const { redirectUnauthenticatedUser } = useContext(AuthContext);
  const { userProfile, getUserProfile, status, error } = useUserProfile();

  useEffect(() => {
    redirectUnauthenticatedUser('/login');
  }, [redirectUnauthenticatedUser]);

  useEffect(
    function fetchUserDataOnInitialLoad() {
      if (!username) {
        return;
      }
      const fetchUserProfile = async () => {
        await getUserProfile(username);
      };
      fetchUserProfile();
    },
    [username],
  );

  if (status === 'error') {
    return <div>{error}</div>;
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <div>&quot;{username}&quot; not found</div>;
  }

  return (
    <div>
      <p>{userProfile._id}</p>
      <p>{userProfile.username}</p>
      <p>{userProfile.email}</p>
      <p>{userProfile.createdAt}</p>
      {userProfile.profile.bio && <p>{userProfile.profile.bio}</p>}
      {userProfile.profile.location && <p>{userProfile.profile.location}</p>}
    </div>
  );
};

export default UserProfile;
