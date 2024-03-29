import SignupForm from '@/components/common/signup-form';
import CenterScreenContainer from '@/components/layout/center-screen-container';

const SignupPage = () => {
  return (
    <CenterScreenContainer>
      <h1 className="sr-only">Signup</h1>
      <SignupForm className="m-auto min-w-[min(450px,80vw)] max-w-3xl" />
    </CenterScreenContainer>
  );
};

export default SignupPage;
