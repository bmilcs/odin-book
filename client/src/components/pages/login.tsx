import LoginForm from '@/components/common/login-form';

const Login = () => {
  return (
    <div className="grid h-full place-items-center">
      <LoginForm className="m-auto min-w-[min(400px,80vw)] max-w-3xl" />
    </div>
  );
};

export default Login;
