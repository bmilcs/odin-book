import mongoose, { Document, Schema, model } from 'mongoose';

export interface IUserProfile {
  bio: string;
  location: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  photo: string;
  profile: IUserProfile;
  friends: mongoose.Types.ObjectId[];
  friendRequestsSent: mongoose.Types.ObjectId[];
  friendRequestsReceived: mongoose.Types.ObjectId[];
}

const userProfileSchema = new Schema<IUserProfile>({
  bio: { type: String, maxlength: 1000 },
  location: { type: String, maxlength: 150 },
});

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String },
  profile: { type: userProfileSchema },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default model<IUser>('User', userSchema);
