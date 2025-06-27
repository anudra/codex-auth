import { Pool } from "pg";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: Request) 
{
  const session = await getServerSession(authOptions);
    if (!session || !session.user?.email)
    {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const result = await pool.query(
      
      "select user_id from users where USER_EMAIL = $1",
      [session.user.email]
    );
  const userid = result.rows[0]?.user_id;

  const r=await pool.query(
      
      "select event_id from registrations where user_id = $1",
      [userid]
    );

const events = r.rows;
  
const eventIds = events.map(e => e.event_id);

const re = await pool.query(
  `SELECT event_id, event_name, event_date, venue, whatsapp_link
   FROM events
   WHERE event_id = ANY($1::uuid[])`,
  [eventIds]
);



    return NextResponse.json(re);
}