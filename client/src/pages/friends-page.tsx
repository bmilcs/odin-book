import { ComponentPropsWithoutRef, FC } from 'react';

type FriendsPageProps = ComponentPropsWithoutRef<'div'> & {
  // ...
};

const FriendsPage: FC<FriendsPageProps> = ({ ...props }) => {
  return <div {...props}></div>;
};

export default FriendsPage;
