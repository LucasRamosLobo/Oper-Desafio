import mongoose from 'mongoose';

const ResponseSchema = new mongoose.Schema({
  email: String,
  content: String,
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