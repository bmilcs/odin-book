import FriendsList from '@/components/common/friends-list';
import NewLineText from '@/components/common/new-line-text';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TUserProfile } from '@/utils/types';
import { ComponentPropsWithoutRef, FC } from 'react';

type UserProfileDetailsProps = ComponentPropsWithoutRef<'div'> & {
  className?: string;
  userProfile: TUserProfile | null;
};

const UserProfileDetails: FC<UserProfileDetailsProps> = ({
  userProfile,
  className = '',
  ...props
}) => {
  if (!userProfile) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Card {...props}>
        <CardHeader className="flex items-start">
          <div>
            <CardTitle className="text-2xl font-extrabold">
              User Profile
            </CardTitle>

            <CardDescription>
              Learn about {userProfile.username}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="sm:grid sm:grid-cols-[max-content_1fr] sm:gap-4">
          {/* Location */}
          <h2 className="text-sm font-bold">Location:</h2>
          <div className="mb-4 sm:mb-0">
            {userProfile.profile?.location ? (
              <p>{userProfile.profile.location}</p>
            ) : (
              <p className="text-muted">N/A</p>
            )}
          </div>

          {/* Email */}

          <h2 className="text-sm font-bold">Email:</h2>
          <div className="mb-4 sm:mb-0">
            {userProfile.email ? (
              <p>
                <a href={`mailto:${userProfile.email}`}>{userProfile.email}</a>
              </p>
            ) : (
              <p className="text-muted">N/A</p>
            )}
          </div>

          {/* Bio */}

          <h2 className="text-sm font-bold">Biography:</h2>
          <div className="mb-4 sm:mb-0">
            {userProfile.profile?.bio ? (
              <NewLineText text={userProfile.profile.bio} />
            ) : (
              <p className="text-muted">N/A</p>
            )}
          </div>

          {/* friends */}
          <h2 className="text-sm font-bold">Friends:</h2>
          {userProfile.friends && userProfile.friends.length > 0 ? (
            <FriendsList friendsList={userProfile.friends} className="grid" />
          ) : (
            <p>None</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileDetails;
