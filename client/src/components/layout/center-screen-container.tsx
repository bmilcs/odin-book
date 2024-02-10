import { ComponentPropsWithoutRef, FC, ReactNode } from 'react';

type CenterScreenContainerProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
};

const CenterScreenContainer: FC<CenterScreenContainerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={`grid h-full place-items-center ${className}`} {...props}>
      {children}
    </div>
  );
};

export default CenterScreenContainer;
