import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
});

export const ImageModel = mongoose.model('Image', ImageSchema);
