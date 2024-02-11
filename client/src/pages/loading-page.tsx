import LoadingSpinner from '@/components/common/loading-spinner';
import CenterScreenContainer from '@/components/layout/center-screen-container';

const LoadingPage = () => {
  return (
    <CenterScreenContainer className="h-screen place-items-center">
      <LoadingSpinner />
    </CenterScreenContainer>
  );
};

export default LoadingPage;
