import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const Collection = mongoose.model('Collection', collectionSchema);
