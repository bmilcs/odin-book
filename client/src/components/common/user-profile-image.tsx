import { Icons } from '@/components/ui/icons';
import { AuthContext, TUser } from '@/context/auth-provider';
import { API_BASE_URL } from '@/utils/env';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

type UserProfileProps = {
  user?: TUser | null;
  className?: string;
};

const UserProfileImage = ({
  user: propUser,
  className = '',
  ...props
}: UserProfileProps) => {
  // if propUser is not provided, use the active user from auth context
  const { user: activeUser } = useContext(AuthContext);
  const user = propUser || activeUser;

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

export default UserProfileImage;
