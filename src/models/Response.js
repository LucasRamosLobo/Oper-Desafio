import mongoose from 'mongoose';

const ResponseSchema = new mongoose.Schema({
  email: String,
  content: String,
  likes: {
    type: Number,
    default: 0,
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Response = mongoose.models.Response || mongoose.model('Response', ResponseSchema);

export default Response;