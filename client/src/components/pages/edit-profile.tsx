import UserProfileUpdateForm from '@/components/common/user-profile-update-form';
import { AuthContext } from '@/components/services/auth-provider';
import { ComponentPropsWithoutRef, FC, useContext } from 'react';

type EditProfilePageProps = ComponentPropsWithoutRef<'div'>;

const EditProfilePage: FC<EditProfilePageProps> = ({ ...props }) => {
  const { user: activeUser } = useContext(AuthContext);

  return <UserProfileUpdateForm data={activeUser!} {...props} />;
};

export default EditProfilePage;
