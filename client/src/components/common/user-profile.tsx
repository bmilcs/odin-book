import FriendActionsButton from '@/components/common/friend-actions-button';
import FriendsList from '@/components/common/friends-list';
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
import { useAuthContext } from '@/hooks/useAuthContext';
import useFetchUserProfile from '@/hooks/useFetchUserProfile';
import { formatDate } from '@/utils/formatters';
import { ComponentPropsWithoutRef, FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type UserProfileProps = ComponentPropsWithoutRef<'div'>;

const UserProfile: FC<UserProfileProps> = ({ ...props }) => {
  const navigate = useNavigate();
  const { username: targetUsername } = useParams();
  const { user: activeUser } = useAuthContext();
  const { fetchUserProfile, userProfile, status, error } =
    useFetchUserProfile();

  const [uploadProfileImageMode, setUploadProfileImageMode] = useState(false);

  useEffect(
    function fetchUserProfileOnParamChange() {
      if (!targetUsername || !activeUser) return;
      fetchUserProfile(targetUsername);
    },
    [targetUsername, fetchUserProfile, activeUser],
  );

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
                {userProfile.createdAt
                  ? `Joined ${formatDate(userProfile.createdAt)}`
                  : ''}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="space-y-4 sm:grid sm:grid-cols-[max-content_1fr] sm:gap-4 sm:space-y-0">
              {/* Location */}
              {userProfile.profile?.location && (
                <>
                  <h2 className="mt-3 text-sm font-bold sm:mt-0">Location:</h2>
                  <p>{userProfile.profile.location}</p>
                </>
              )}

              {/* Email */}
              {userProfile.email && (
                <>
                  <h2 className="mt-3 text-sm font-bold sm:mt-0">Email:</h2>
                  <a href={`mailto:${userProfile.email}`}>
                    {userProfile.email}
                  </a>
                </>
              )}

              {/* Bio */}
              {userProfile.profile?.bio && (
                <>
                  <h2 className="mb-1 text-sm font-bold">Biography:</h2>
                  <NewLineText text={userProfile.profile.bio} />
                </>
              )}

              {/* friends */}
              <h2 className="mb-1 text-sm font-bold">Friends:</h2>

              {userProfile.friends ? (
                <>
                  <FriendsList
                    friendsList={userProfile.friends}
                    className="grid"
                  />
                </>
              ) : (
                <p>N/A</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions: Friend request handling */}
        <div className="flex items-center justify-center gap-4 p-2">
          {activeUser?.username === userProfile.username ? (
            <>
              <Button
                className="btn-secondary"
                onClick={handleEditProfile}
                type="button"
              >
                Edit Profile
              </Button>

              <Button onClick={handleUpdateProfileImage} type="button">
                Update Profile Image
              </Button>
            </>
          ) : (
            <FriendActionsButton userId={userProfile._id} />
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
