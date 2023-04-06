import mongoose, { Schema, Document, InferSchemaType } from 'mongoose';

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastNameInitial: {
    type: String,
    trim: true,
    required: true,
    maxLength: 1,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
    required: false,
  },
  biography: {
    type: String,
    trim: true,
    required: false,
    maxLength: 500,
  },
  // listings: {
  //   type: String,
  // }, // <---------- add once Book schema is created
});

export type UserType = Document & InferSchemaType<typeof UserSchema>;
export default mongoose.model('User', UserSchema);
