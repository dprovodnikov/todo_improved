import mongoose, { Schema } from 'mongoose';

const eventSchema = new Schema({
  text: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

export default mongoose.model('Event', eventSchema);