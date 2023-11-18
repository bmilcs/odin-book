import LoadingSpinner from '@/components/common/loading-spinner';

const LoadingPage = () => {
  return (
    <main className="grid min-h-screen w-screen place-items-center bg-primary">
      <LoadingSpinner />
    </main>
  );
};

export default LoadingPage;
