import { ComponentPropsWithoutRef, FC, ReactNode } from 'react';

type MainProps = ComponentPropsWithoutRef<'main'> & {
  children: ReactNode;
};

const Main: FC<MainProps> = ({ children, ...props }) => {
  return (
    <main className="flex flex-grow" {...props}>
      <div className="mx-auto max-w-7xl flex-grow p-4 md:p-6 lg:p-8">
        {children}
      </div>
    </main>
  );
};

export default Main;
