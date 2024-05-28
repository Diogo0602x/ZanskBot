import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  cnpj: string;
  companyName: string;
  companySocialName: string;
  phone: string;
  email: string;
  companySize: string;
  password: string;
}

const userSchema: Schema = new Schema({
  cnpj: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  companySocialName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  companySize: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
