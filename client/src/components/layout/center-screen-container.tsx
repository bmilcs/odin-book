import { ComponentPropsWithoutRef, FC, ReactNode } from 'react';

type CenterScreenContainerProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
};

const CenterScreenContainer: FC<CenterScreenContainerProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default CenterScreenContainer;
