import { Icons } from '@/components/ui/icons';
import { API_BASE_URL } from '@/utils/env';
import { TFriend, TUser, TUserSearchResult } from '@/utils/types';
import { Link } from 'react-router-dom';

type UserImageProps = {
  user: TUser | TFriend | TUserSearchResult | null;
  linkToProfile?: boolean;
  className?: string;
};

const UserImage = ({
  user,
  linkToProfile = true,
  className = '',
  ...props
}: UserImageProps) => {
  // If the user has a photo, display it
  if (user?.photo) {
    const imgUrl = `${API_BASE_URL}${user.photo}`;
    return linkToProfile ? (
      <Link to={`/users/${user.username}`}>
        <img
          src={imgUrl}
          alt={`${user.username}'s photo`}
          className={`aspect-square object-cover shadow ${className}`}
          {...props}
        />
      </Link>
    ) : (
      <img
        src={imgUrl}
        alt={`${user.username}'s photo`}
        className={`aspect-square object-cover shadow ${className}`}
        {...props}
      />
    );
  }

  return linkToProfile ? (
    <Link to={`/users/${user?.username}`}>
      <Icons.userPlaceholder
        className={`rounded-xl bg-slate-100 fill-slate-300 text-primary shadow dark:bg-accent ${className}`}
        {...props}
      />
    </Link>
  ) : (
    <Icons.userPlaceholder
      className={`rounded-xl bg-slate-100 fill-slate-300 text-primary shadow dark:bg-accent ${className}`}
      {...props}
    />
  );
};

export default UserImage;
