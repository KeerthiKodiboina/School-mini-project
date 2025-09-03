import { connectDB } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT id, name, address, city, image FROM schools ORDER BY id DESC");
    await db.end();
    res.status(200).json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
