import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  // Get session
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user_id from DB using session email
  const userRes = await pool.query(
    "SELECT user_id FROM users WHERE user_email = $1",
    [session.user.email]
  );
  if (!userRes.rows[0]) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const user_id = userRes.rows[0].user_id;

  // Get event_id from frontend
  const { events_id } = await req.json();

  // Generate reg_id (for example, using uuid)
  const { v4: uuidv4 } = require('uuid');
  const reg_id = uuidv4();

  try {

 const res = await pool.query("SELECT event_id FROM events WHERE event_name=$1", [events_id]);
const event_id = res.rows[0]?.event_id; // get the actual uuid value

if (!event_id) {
  return NextResponse.json({ error: "Event not found" }, { status: 404 });
}

await pool.query(
  "INSERT INTO registrations (reg_id, user_id, event_id) VALUES ($1, $2, $3)",
  [reg_id, user_id, event_id] // pass the uuid only
);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}