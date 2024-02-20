//
// api types
//

export type TApiResponse = {
  success: boolean;
  error: string;
  message: string;
  data?: unknown;
};

export type TExpressValidatorError = {
  msg: string;
  path: string;
  type: string;
  value: string;
};

//
// user & friend types
//

export type TUniversalUserDetails = {
  _id: string;
  username: string;
  photo: string;
};

export type TUser = TUniversalUserDetails & {
  email: string;
  profile: {
    bio: string;
    location: string;
  };
  friends: TFriend[];
  friendRequestsReceived: TFriendRequest[];
  friendRequestsSent: TFriendRequest[];
  notifications: TNotification[];
  createdAt: string;
  updatedAt: string;
};

export type TFriend = TUniversalUserDetails & {
  email: string;
};

export type TFriendRequest = TUniversalUserDetails;

export type TUserSearchResult = TUniversalUserDetails;

export type TFindFriendsUser = TUniversalUserDetails;

export type TUserProfileDetails = {
  username: string;
  email: string;
  profile: {
    location: string;
    bio: string;
  };
};

//
// notifications
//

export type TNotification = {
  type: string;
  fromUser: TUser;
  toUser: string;
  post: string;
  read: boolean;
  _id: string;
};

//
// posts, comments, likes
//

export type TComment = {
  _id: string;
  content: string;
  author: TUser;
  post: TPost['_id'];
  likes: TLike[];
  createdAt: string;
  updatedAt: string;
};

export type TPost = {
  _id: string;
  content: string;
  author: TUser;
  comments: TComment[];
  likes: TLike[];
  createdAt: string;
  updatedAt: string;
};

export type TLike = {
  _id: string;
  user: TUser;
  post?: TPost;
  comment?: TComment;
  createdAt: string;
};
