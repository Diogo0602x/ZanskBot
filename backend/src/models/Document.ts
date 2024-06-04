import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';
import { IDocument } from '../types/type';

const DocumentSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model<IDocument>('Document', DocumentSchema);