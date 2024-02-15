import NewLineText from '@/components/common/new-line-text';
import UserProfileImageUploadForm from '@/components/common/user-profile-image-upload-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import useAcceptFriendRequest from '@/hooks/useAcceptFriendRequest';
import { useAuthContext } from '@/hooks/useAuthContext';
import useCancelFriendRequest from '@/hooks/useCancelFriendRequest';
import useDeleteFriend from '@/hooks/useDeleteFriend';
import useFetchUserProfile from '@/hooks/useFetchUserProfile';
import useRejectFriendRequest from '@/hooks/useRejectFriendRequest';
import useSendFriendRequest from '@/hooks/useSendFriendRequest';
import { formatDate } from '@/utils/formatters';
import { ComponentPropsWithoutRef, FC, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

type UserProfileProps = ComponentPropsWithoutRef<'div'>;

const UserProfile: FC<UserProfileProps> = ({ ...props }) => {
  const navigate = useNavigate();
  const { username: targetUsername } = useParams();
  const { user: activeUser } = useAuthContext();
  const { sendFriendRequest } = useSendFriendRequest();
  const { acceptFriendRequest } = useAcceptFriendRequest();
  const { rejectFriendRequest } = useRejectFriendRequest();
  const { cancelFriendRequest } = useCancelFriendRequest();
  const { deleteFriend } = useDeleteFriend();
  const {
    fetchUserProfile,
    userProfile,
    status,
    error,
    isFriend,
    isInIncomingFriendRequests,
    isInOutgoingFriendRequests,
    isProfileOwner,
  } = useFetchUserProfile();

  const [uploadProfileImageMode, setUploadProfileImageMode] = useState(false);

  useEffect(
    function fetchUserProfileOnParamChange() {
      if (!targetUsername || !activeUser) return;
      fetchUserProfile(targetUsername);
    },
    [targetUsername, fetchUserProfile, activeUser],
  );

  const handleFriendStatusToggle = () => {
    if (isFriend) {
      deleteFriend(userProfile!._id);
      return;
    }
    sendFriendRequest(userProfile!._id);
  };

  const handleCancelFriendRequest = () => {
    cancelFriendRequest(userProfile!._id);
  };

  const handleAcceptFriendRequest = () => {
    acceptFriendRequest(userProfile!._id);
  };

  const handleRejectFriendRequest = () => {
    rejectFriendRequest(userProfile!._id);
  };

  const handleUpdateProfileImage = () => {
    setUploadProfileImageMode((prev) => !prev);
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
      <div className="mx-auto flex flex-col gap-2">
        <Card {...props}>
          <CardHeader className="flex items-start">
            <div>
              <CardTitle className="text-3xl font-extrabold">
                {userProfile.username}
              </CardTitle>

              <CardDescription>
                Joined {formatDate(userProfile.createdAt)}
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

        {/* Actions: Friend request handling */}
        <div className="flex items-center justify-center gap-4 p-2">
          {isProfileOwner ? (
            <>
              <Button onClick={handleUpdateProfileImage}>
                Update Profile Image
              </Button>
              <Button onClick={handleEditProfile}>Edit Profile</Button>
            </>
          ) : isFriend ? (
            <Button onClick={handleFriendStatusToggle}>
              {isFriend ? 'Remove Friend' : 'Add Friend'}
            </Button>
          ) : isInOutgoingFriendRequests ? (
            <Button onClick={handleCancelFriendRequest}>
              Cancel Request Sent
            </Button>
          ) : isInIncomingFriendRequests ? (
            <>
              <Button onClick={handleAcceptFriendRequest}>
                Accept Friend Request
              </Button>
              <Button onClick={handleRejectFriendRequest}>
                Reject Friend Request
              </Button>
            </>
          ) : (
            <Button onClick={handleFriendStatusToggle}>Add Friend</Button>
          )}
        </div>

        {uploadProfileImageMode && (
          <UserProfileImageUploadForm onClose={handleUpdateProfileImage} />
        )}
      </div>
    );
  }
};

export default UserProfile;
