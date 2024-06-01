import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';
import { IQuestion } from '../types/type';

const QuestionSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{
    questionNumber: { type: Number, required: true },
    questionText: { type: String, required: true },
  }],
}, { timestamps: true });

export default mongoose.model<IQuestion>('Question', QuestionSchema);
