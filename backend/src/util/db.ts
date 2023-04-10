/* eslint-disable @typescript-eslint/no-non-null-assertion */
import mongoose from 'mongoose';
import { config } from './config';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoDB.uri);

    console.log('MongoDB Connected');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
