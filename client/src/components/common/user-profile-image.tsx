import { Icons } from '@/components/ui/icons';
import { AuthContext } from '@/context/auth-provider';
import { useContext } from 'react';

type UserProfileProps = {
  className?: string;
};

const UserProfileImage = ({ className = '', ...props }: UserProfileProps) => {
  const { user } = useContext(AuthContext);

  if (user?.photo) {
    return (
      <img
        src={user.photo}
        alt="Profile Image"
        className={`${className}`}
        {...props}
      />
    );
  }

  return (
    <Icons.userPlaceholder
      className={`rounded-xl bg-slate-100 fill-slate-300 text-primary dark:bg-accent ${className}`}
      {...props}
    />
  );
};

export default UserProfileImage;
