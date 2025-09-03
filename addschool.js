import formidable from "formidable";
import fs from "fs";
import path from "path";
import { connectDB } from "../../lib/db";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const uploadDir = path.join(process.cwd(), "/public/schoolImages");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = new formidable.IncomingForm({ uploadDir, keepExtensions: true });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Form parse error" });

    try {
      const { name, address, city, state, contact, email_id } = fields;
      // `files.image` may be undefined if no file
      const imagePath = files.image ? path.basename(files.image.filepath) : null;

      const db = await connectDB();
      await db.execute(
        "INSERT INTO schools (name,address,city,state,contact,image,email_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, address, city, state, contact, imagePath, email_id]
      );
      await db.end();
      res.status(200).json({ message: "School added" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}
