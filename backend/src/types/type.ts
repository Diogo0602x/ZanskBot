import mongoose, { Document as MongooseDocument } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

export interface IUser extends Document {
  id?: string;
  cnpj: string;
  companyName: string;
  companySocialName: string;
  phone: string;
  email: string;
  companySize: string;
  password: string;
}


declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}

export interface IDocument extends MongooseDocument {
  user: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface IQuestion {
  questionNumber: number;
  questionText: string;
}

export interface IUserQuestion extends Document {
  user: mongoose.Schema.Types.ObjectId;
  questions: IQuestion[];
}

export interface IQuestionDocument extends IQuestion, MongooseDocument {}