import { AuthContext } from '@/components/services/auth-provider';
import useUserProfile from '@/hooks/useUserProfile';
import { formatDate } from '@/utils/formatters';
import { HTMLAttributes, useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import UserProfileUpdateForm from '@/components/common/user-profile-update-form';
import { FC } from 'react';

type UserProfileProps = HTMLAttributes<HTMLDivElement>;

const UserProfile: FC<UserProfileProps> = ({ ...props }) => {
  const { username: targetUsername } = useParams();
  const { user: activeUser } = useContext(AuthContext);
  const { userProfile, getUserProfile, status, error } = useUserProfile();
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Fetch user profile on targetUsername change and
  // check if it's the active user's profile
  useEffect(() => {
    if (!targetUsername || !activeUser) return;
    if (activeUser.username === targetUsername) {
      setIsOwnProfile(true);
    } else {
      setIsOwnProfile(false);
    }
    getUserProfile(targetUsername);
  }, [targetUsername, getUserProfile, activeUser]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>{error}</div>;
  }

  if (userProfile) {
    return (
      <div {...props}>
        <h2 className="text-3xl font-extrabold">{userProfile.username}</h2>
        {userProfile.email && <p>{userProfile.email}</p>}
        {userProfile.createdAt && (
          <p>Joined {formatDate(userProfile.createdAt)}</p>
        )}
        {userProfile.profile?.bio && <p>{userProfile.profile.bio}</p>}
        {userProfile.profile?.location && <p>{userProfile.profile.location}</p>}
        {userProfile.friends && (
          <div>
            <p>Friends:</p>
            {userProfile.friends.length === 0 ? (
              <p>No friends yet</p>
            ) : (
              <ul>
                {userProfile.friends.map((friend) => (
                  <li key={friend._id}>
                    <Link to={`/users/${friend.username}`}>
                      {friend.username}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {isOwnProfile && <UserProfileUpdateForm data={userProfile} />}
      </div>
    );
  }
};

export default UserProfile;
