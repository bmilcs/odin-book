import SignupForm from '@/components/common/signup-form';

const Signup = () => {
  return (
    <div className="grid h-full place-items-center">
      <SignupForm className="m-auto min-w-[min(400px,80vw)] max-w-3xl" />;
    </div>
  );
};

export default Signup;
