import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../types/type';

const userSchema: Schema = new Schema({
  cnpj: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  companySocialName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  companySize: { type: String, required: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
