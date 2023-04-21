import mongoose from 'mongoose';
import {User} from '../../interfaces/User';

// Mongoose schema for the User model
const userModel = new mongoose.Schema<User>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// Return the string representation of the _id field
userModel.virtual('id').get(function () {
  return this._id.toHexString();
});

// Set the 'toJSON' option to include virtual properties
userModel.set('toJSON', {
  virtuals: true,
});

export default mongoose.model('User', userModel);
