import LoadingSpinner from '@/components/common/loading-spinner';
import CenterScreenContainer from '@/components/layout/center-screen-container';

const LoadingPage = () => {
  return (
    <CenterScreenContainer className="min-h-screen w-screen bg-primary">
      <LoadingSpinner />
    </CenterScreenContainer>
  );
};

export default LoadingPage;
