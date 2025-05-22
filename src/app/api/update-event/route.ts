import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Pool } from "pg";

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

// GET: List all events for dropdown
export async function GET() {
  const res = await pool.query("SELECT event_id, event_name FROM events ORDER BY event_date DESC");
  return NextResponse.json({ events: res.rows });
}

// POST: Get details of a single event by ID
export async function POST(req: NextRequest) {
  const { event_id } = await req.json();
  const res = await pool.query("SELECT * FROM events WHERE event_id=$1", [event_id]);
  if (res.rows.length === 0) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  return NextResponse.json({ event: res.rows[0] });
}

// PUT: Update selected event (admin only)
export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email || !(await isAdmin(session.user.email))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { event_id, event_name, event_date, duration, reg_link, poster, visibility } = await req.json();
  await pool.query(
    `UPDATE events SET event_name=$1, event_date=$2, duration=$3, reg_link=$4, poster=$5, visibility=$6, updated_at=NOW()
     WHERE event_id=$7`,
    [event_name, event_date, duration, reg_link, poster, visibility, event_id]
  );
  return NextResponse.json({ success: true });
}