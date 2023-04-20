import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  email: String,
  content: String,
  likes: Number,
  id_notice: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

let Posts;

try {
  // Tenta obter o modelo 'Client' compilado
  Posts = mongoose.model('Client');
} catch {
  // Se o modelo 'Client' não existir, compila-o com o esquema 'ClientSchema'
  Posts = mongoose.model('Client', ClientSchema);
}

export default Posts;
