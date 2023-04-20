import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  email: String,
  content: String,
  likes: {
    type: Number,
    default: 0,
  },
  id_notice: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});


let Comment;

try {
  // Tenta obter o modelo 'Comment' compilado
  Comment = mongoose.model('Comment');
} catch {
  // Se o modelo 'Comment' não existir, compila-o com o esquema 'CommentSchema'
  Comment = mongoose.model('Comment', CommentSchema);
}

export default Comment;
