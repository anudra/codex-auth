// /app/api/edit-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      user_name,
      roll_no,
      semester,
      branch,
      college_name,
      profile_pic, // optional: if you're editing image too
    } = await req.json();

    await pool.query(
      `UPDATE users
       SET user_name = $1,
           roll_no = $2,
           semester = $3,
           branch = $4,
           college_name = $5,
           profile_pic=$6
       WHERE user_email = $7`,
      [user_name, roll_no, semester, branch, college_name,profile_pic, session.user.email]
    );
console.log(profile_pic);
    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("PUT /api/edit-profile error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
