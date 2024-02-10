import { ComponentPropsWithoutRef, FC, ReactNode } from 'react';

type CenterColumnContainerProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
};

const CenterColumnContainer: FC<CenterColumnContainerProps> = ({
  children,
  ...props
}) => {
  return (
    <div className="mx-auto max-w-3xl" {...props}>
      {children}
    </div>
  );
};

export default CenterColumnContainer;
