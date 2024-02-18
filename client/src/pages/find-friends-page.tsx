import { ComponentPropsWithoutRef, FC } from 'react';

type FindFriendsPageProps = ComponentPropsWithoutRef<'div'> & {
  // ...
};

const FindFriendsPage: FC<FindFriendsPageProps> = ({ ...props }) => {
  return <div {...props}></div>;
};

export default FindFriendsPage;
