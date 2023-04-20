import Client from "../../../models/Posts";
import dbConnect from "../../../services/db";

dbConnect();

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const clients = await Client.find({});
        res.status(200).json({success: true, data:clients });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
      break;

    case "POST":
      try {
        const { email, content, id_notice } = req.body;

        if (!email || !content || !id_notice) throw "invalid data";
        const client = await Client.create({ email, content, id_notice });

        res.status(201).json({success:true, data:client});
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
      }
      break;
  }
}