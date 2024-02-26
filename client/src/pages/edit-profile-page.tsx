import UserProfileUpdateForm from '@/components/common/user-profile-update-form';
import CenterColumnContainer from '@/components/layout/center-column-container';

const EditProfilePage = () => {
  return (
    <CenterColumnContainer>
      <h1 className="sr-only">Edit Profile</h1>
      <UserProfileUpdateForm />
    </CenterColumnContainer>
  );
};

export default EditProfilePage;
