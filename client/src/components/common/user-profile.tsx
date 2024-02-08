import { AuthContext } from '@/components/services/auth-provider';
import useUserProfile from '@/hooks/useUserProfile';
import { formatDate } from '@/utils/formatters';
import {
  ComponentPropsWithoutRef,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import NewLineText from '@/components/common/new-line-text';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import useFriends from '@/hooks/useFriends';
import { FC } from 'react';

type UserProfileProps = ComponentPropsWithoutRef<'div'>;

const UserProfile: FC<UserProfileProps> = ({ ...props }) => {
  const navigate = useNavigate();
  const { username: targetUsername } = useParams();
  const { user: activeUser } = useContext(AuthContext);
  const { userProfile, getUserProfile, status, error } = useUserProfile();
  const { sendFriendRequest, deleteFriend } = useFriends();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  // TODO: Handle existing friend requests - incoming or outgoing

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

  // Determine if user is a friend of the active user
  useEffect(() => {
    if (activeUser && userProfile) {
      const isFriend = userProfile.friends.some(
        (friend) => friend._id === activeUser._id,
      );
      setIsFriend(isFriend);
    }
  }, [activeUser, userProfile]);

  const handleFriendStatusToggle = () => {
    if (isFriend) {
      deleteFriend(userProfile!._id);
      return;
    }

    sendFriendRequest(userProfile!._id);
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>{error}</div>;
  }

  if (userProfile) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        <Card {...props}>
          <CardHeader className="flex items-start">
            <div>
              <CardTitle className="text-3xl font-extrabold">
                {userProfile.username}
              </CardTitle>

              <CardDescription>
                {userProfile.createdAt && (
                  <p>Joined {formatDate(userProfile.createdAt)}</p>
                )}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="sm:grid sm:grid-cols-[max-content_1fr] sm:gap-4">
              {/* Bio */}
              <h2 className="mb-1 text-sm font-bold">Biography:</h2>
              {userProfile.profile?.bio ? (
                <NewLineText text={userProfile.profile.bio} />
              ) : (
                <p>N/A</p>
              )}

              {/* Location */}
              <h2 className="mt-3 text-sm font-bold sm:mt-0">Location:</h2>
              {userProfile.profile?.location ? (
                <p>{userProfile.profile.location}</p>
              ) : (
                <p>N/A</p>
              )}

              {/* Email */}
              <h2 className="mt-3 text-sm font-bold sm:mt-0">Email:</h2>
              {userProfile.email ? (
                <a href={`mailto:${userProfile.email}`}>{userProfile.email}</a>
              ) : (
                <p>N/A</p>
              )}

              {/* friends */}
              <h2 className="mb-1 text-sm font-bold">Friends:</h2>
              {userProfile.friends ? (
                <>
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
                </>
              ) : (
                <p>N/A</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions: Add / remove friend or Edit Profile */}
        <div className="flex items-center justify-center p-2">
          {isOwnProfile ? (
            <Button onClick={handleEditProfile}>Edit Profile</Button>
          ) : (
            <Button onClick={handleFriendStatusToggle}>
              {isFriend ? 'Remove Friend' : 'Add Friend'}
            </Button>
          )}
        </div>
      </div>
    );
  }
};

export default UserProfile;
