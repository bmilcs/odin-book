import UserProfileImageUploadForm from '@/components/common/user-profile-image-upload-form';
import { Button } from '@/components/ui/button';
import { ComponentPropsWithoutRef, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UserProfileActiveUserButtonsProps = ComponentPropsWithoutRef<'button'>;

const UserProfileActiveUserButtons: FC<UserProfileActiveUserButtonsProps> = ({
  ...props
}) => {
  const navigate = useNavigate();
  const [uploadProfileImageMode, setUploadProfileImageMode] = useState(false);

  const handleUpdateProfileImage = () => {
    setUploadProfileImageMode((prev) => !prev);
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <>
      <Button onClick={handleUpdateProfileImage} {...props}>
        Update Profile Image
      </Button>
      <Button className="btn-secondary" onClick={handleEditProfile} {...props}>
        Edit Profile
      </Button>

      {uploadProfileImageMode && (
        <UserProfileImageUploadForm onClose={handleUpdateProfileImage} />
      )}
    </>
  );
};

export default UserProfileActiveUserButtons;
