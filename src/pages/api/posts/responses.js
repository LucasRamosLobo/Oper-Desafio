import dbConnect from '../../../services/db';
import Response from '../../../models/Response';

dbConnect();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, content, commentId } = req.body;

    if (!email || !content || !commentId) {
      res.status(400).json({ message: 'Dados inválidos' });
      return;
    }

    try {
      const response = await Response.create({ email, content, commentId });
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error });
    }
  } else if (req.method === 'GET') {
    try {
      const responses = await Response.find({});
      res.status(200).json({ success: true, data: responses });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error });
    }
} else if (req.method === 'PUT') {
    try {
      const { id } = req.body;
      const comment = await Response.findById(id);
      if (!comment) throw new Error("comment not found");
      comment.likes += 1;
      await comment.save();
  
      res.status(200).json({ success: true, data: comment });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error });
    }
  }
}