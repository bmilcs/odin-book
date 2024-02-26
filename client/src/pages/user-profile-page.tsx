import LoadingSpinner from '@/components/common/loading-spinner';
import Post from '@/components/common/post';
import UserImage from '@/components/common/user-image';
import UserProfileActiveUserButtons from '@/components/common/user-profile-active-user-buttons';
import UserProfileDetails from '@/components/common/user-profile-details';
import UserProfileFriendActionsButton from '@/components/common/user-profile-friend-actions-button';
import CenterScreenContainer from '@/components/layout/center-screen-container';
import useFetchUserProfile from '@/hooks/useFetchUserProfile';
import useUserRelationships from '@/hooks/useUserRelationships';
import { formatDate } from '@/utils/formatters';
import { TPost } from '@/utils/types';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserProfilePage = () => {
  const { username: targetUsername } = useParams();
  const { isUserTheActiveUser } = useUserRelationships();
  const { fetchUserProfile, userProfile, status, error } =
    useFetchUserProfile();
  const { getFriendStatus } = useUserRelationships();

  useEffect(
    function fetchUserProfileOnParamChange() {
      if (!targetUsername) return;
      fetchUserProfile(targetUsername);
    },
    [targetUsername, fetchUserProfile],
  );

  if (status === 'error') {
    return <CenterScreenContainer>{error}</CenterScreenContainer>;
  }

  if (status === 'loading') {
    return (
      <CenterScreenContainer>
        <LoadingSpinner />
      </CenterScreenContainer>
    );
  }

  if (!userProfile) {
    return <CenterScreenContainer>User not found</CenterScreenContainer>;
  }

  const isActiveUser = isUserTheActiveUser(userProfile._id);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr,30%] md:gap-10 md:space-y-0">
      <h1 className="sr-only">User Profile</h1>
      <div className="order-2 space-y-5 md:order-1">
        <UserProfileDetails userProfile={userProfile} />

        <h2 className="text-2xl font-bold">Recent Posts</h2>

        <div className="space-y-5">
          {userProfile.recentPosts ? (
            userProfile.recentPosts.map((post: TPost) => (
              <Post key={post._id} data={post} />
            ))
          ) : (
            <p>
              Add {userProfile.username} to your friends to access their posts.
            </p>
          )}
        </div>
      </div>

      <div className="order-1 space-y-5 md:order-2">
        <div>
          <UserImage
            user={userProfile}
            className="max-h-[300px] w-full rounded-xl object-cover md:max-h-none"
          />
          <h1 className="mt-4 text-3xl font-extrabold">
            {userProfile?.username}
          </h1>

          <p>
            Status:{' '}
            <span className="font-bold">
              {getFriendStatus(userProfile._id)}
            </span>
          </p>

          {userProfile.createdAt && (
            <p>Joined {formatDate(userProfile.createdAt)}</p>
          )}
        </div>

        {/* Actions: Friend request handling / Edit Profile handling */}
        <div className="flex flex-wrap items-center gap-2">
          {isActiveUser ? (
            <UserProfileActiveUserButtons />
          ) : (
            <UserProfileFriendActionsButton userId={userProfile._id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
