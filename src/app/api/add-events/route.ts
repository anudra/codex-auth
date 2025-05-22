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

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const email = session.user.email;
  if (!(await isAdmin(email))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }


  return NextResponse.json({
    success: true,

    message: "Admin verified. You can now add, update, or delete events.",
  });
}