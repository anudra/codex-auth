import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

async function isAdmin(email: string) {
  const res = await pool.query("SELECT is_admin FROM users WHERE user_email=$1", [email]);
  return res.rows[0]?.is_admin === true;
}

// GET: List all events
export async function GET() {
  const res = await pool.query("SELECT * FROM events WHERE visibility = true ORDER BY event_date DESC");
  return NextResponse.json({ events: res.rows });
}

// POST: Add new event
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email || !(await isAdmin(session.user.email))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { event_name, event_date, duration, reg_link, poster } = await req.json();
  const event_id = uuidv4();
  await pool.query(
    `INSERT INTO events (event_id, event_name, event_date, duration, reg_link, poster)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [event_id, event_name, event_date, duration, reg_link, poster]
  );
  return NextResponse.json({ success: true });
}

// PUT: Update event
export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email || !(await isAdmin(session.user.email))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { event_id, event_name, event_date, duration, reg_link, poster } = await req.json();
  await pool.query(
    `UPDATE events SET event_name=$1, event_date=$2, duration=$3, reg_link=$4, poster=$5, updated_at=NOW()
     WHERE event_id=$6`,
    [event_name, event_date, duration, reg_link, poster, event_id]
  );
  return NextResponse.json({ success: true });
}

// DELETE: Remove event
export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email || !(await isAdmin(session.user.email))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { event_id } = await req.json();
  await pool.query("DELETE FROM events WHERE event_id=$1", [event_id]);
  return NextResponse.json({ success: true });
}