import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema, model, models } from 'mongoose';

export interface IUserProfile {
  bio: string;
  location: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  photo: string;
  profile: IUserProfile;
  friends: mongoose.Types.ObjectId[];
  friendRequestsSent: mongoose.Types.ObjectId[];
  friendRequestsReceived: mongoose.Types.ObjectId[];
  notifications: mongoose.Types.ObjectId[];
  createdAt: Date;
  comparePassword: (
    candidatePassword: string,
    next: (err: any, isMatch: boolean) => void,
  ) => void;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      // case-insensitive search
      collation: { locale: 'en', strength: 2 },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // case-insensitive search
      collation: { locale: 'en', strength: 2 },
    },
    password: { type: String, required: true },
    photo: { type: String },
    profile: { type: Object, default: { bio: '', location: '' } },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  },
  { timestamps: true }, // auto create 'createdAt' and 'updatedAt' fields
);

// case-insensitive search
userSchema.index(
  { username: 1, email: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } },
);

// hash password before saving to database
userSchema.pre<IUser>('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (err: any) {
    next(err);
  }
});

// compare supplied password vs. stored password
userSchema.methods.comparePassword = function (
  candidatePassword: string,
  next: (err: any, isMatch: boolean) => void,
) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return next(err, false);
    next(null, isMatch);
  });
};

export default models['User'] || model<IUser>('User', userSchema);
