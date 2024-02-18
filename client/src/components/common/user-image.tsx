import { Icons } from '@/components/ui/icons';
import { API_BASE_URL } from '@/utils/env';
import { TFriend, TUser } from '@/utils/types';
import { Link } from 'react-router-dom';

type UserImageProps = {
  user?: TUser | TFriend | null;
  className?: string;
};

const UserImage = ({ user, className = '', ...props }: UserImageProps) => {
  if (user?.photo) {
    const imgUrl = `${API_BASE_URL}${user.photo}`;
    return (
      <Link to={`/users/${user.username}`}>
        <img
          src={imgUrl}
          alt={`${user.username}'s profile image`}
          className={`aspect-square object-cover shadow ${className}`}
          {...props}
        />
      </Link>
    );
  }

  return (
    <Link to={`/users/${user?.username}`}>
      <Icons.userPlaceholder
        className={`rounded-xl bg-slate-100 fill-slate-300 text-primary shadow dark:bg-accent ${className}`}
        {...props}
      />
    </Link>
  );
};

export default UserImage;
