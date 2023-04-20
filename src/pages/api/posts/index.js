import Comment from "../../../models/Posts";
import dbConnect from "../../../services/db";

dbConnect();

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const clients = await Comment.find({});
        res.status(200).json({success: true, data:clients });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
      break;
      case "PUT":
        try {
          const { _id } = req.body;
          const comment = await Comment.findById(_id);
      console.log(comment)
          if (!comment) throw "comment not found";
          comment.likes += 1;
          await comment.save();
      
          res.status(200).json({ success: true, data: comment });
        } catch (error) {
          console.log(error);
          res.status(500).json({ success: false, error });
        }
        break;
    case "POST":
      try {
        const { email, content, id_notice } = req.body;

        if (!email || !content || !id_notice) throw "invalid data";
        const client = await Comment.create({ email, content, id_notice });

        res.status(201).json({success:true, data:client});
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
      break;
  }
}