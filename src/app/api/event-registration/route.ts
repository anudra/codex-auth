import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRes = await pool.query(
    "SELECT user_id FROM users WHERE user_email = $1",
    [session.user.email]
  );

  const userId = userRes.rows[0]?.user_id;

  if (!userId) {
    return NextResponse.json({ events: [] });
  }

  const regRes = await pool.query(
    "SELECT event_id FROM registrations WHERE user_id = $1",
    [userId]
  );

  const eventIds = regRes.rows.map(r => r.event_id);

  if (!eventIds.length) {
    return NextResponse.json({ events: [] });
  }

  const eventsRes = await pool.query(
    `SELECT event_id, event_name, event_date, venue, whatsapp_link 
     FROM events 
     WHERE event_id = ANY($1::uuid[])`,
    [eventIds]
  );

  return NextResponse.json({ events: eventsRes.rows });
}
