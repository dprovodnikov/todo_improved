import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
  text: {
    type: String,
    require: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: Date,
    require: true,
  },
  priority: {
    type: Number,
    require: true,
  },
  folder: {
    type: Schema.ObjectId,
    ref: 'Folder',
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User',
  }
});

export default mongoose.model('Task', taskSchema);