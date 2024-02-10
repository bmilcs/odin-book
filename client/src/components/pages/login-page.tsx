import LoginForm from '@/components/common/login-form';
import CenterScreenContainer from '@/components/layout/center-screen-container';

const LoginPage = () => {
  return (
    <CenterScreenContainer>
      <LoginForm className="m-auto min-w-[min(450px,80vw)] max-w-3xl" />
    </CenterScreenContainer>
  );
};

export default LoginPage;
