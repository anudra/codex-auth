import { getServerSession } from "next-auth/next";

import { authOptions } from "../auth/[...nextauth]/route";
import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

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

  const { rows } = await pool.query(
    "SELECT USER_NAME, USER_EMAIL, ROLL_NO, SEMESTER, BRANCH,COLLEGE_NAME,profile_pic FROM USERS WHERE USER_EMAIL = $1",
    [session.user.email]
  );

  if (!rows[0]) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  
  const { rollNo, semester, branch, username } = body;
  
  console.log("Parsed values:", { rollNo, semester, branch, username, email }); // Debug log

  try {
    const result = await pool.query(
      "UPDATE USERS SET ROLL_NO = $1, SEMESTER = $2, BRANCH = $3, USER_NAME = $4 WHERE USER_EMAIL = $5",
      [rollNo, semester, branch, username, email]
    );
    
    console.log("Update result:", result.rowCount); // Debug log
    
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "User not found or no changes made" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Database error:", err);
    return NextResponse.json({ 
      error: "Failed to update", 
      details: err instanceof Error ? err.message : "Unknown error" 
    }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  
  const { email: userEmail, user_name, image } = body;
  
  

  try {
    // First check if user exists
    const { rows: existingUser } = await pool.query(
      "SELECT USER_EMAIL FROM USERS WHERE USER_EMAIL = $1",
      [email]
    );

    if (existingUser.length === 0) {
      // User doesn't exist, create new user with Google info
      // Include all required columns with default values
      await pool.query(
        `INSERT INTO USERS (USER_EMAIL, USER_NAME, profile_pic, COLLEGE_NAME, ROLL_NO, SEMESTER, BRANCH) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          userEmail || email, 
          user_name, 
          image, 
          'GITAM', // Default college name
          null,    // ROLL_NO will be set later
          null,    // SEMESTER will be set later  
          null     // BRANCH will be set later
        ]
      );
      
    } else {
      // User exists, update Google info only
      await pool.query(
        "UPDATE USERS SET USER_NAME = $1, profile_pic = $2 WHERE USER_EMAIL = $3",
        [user_name, image, email]
      );
     
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH - Database error:", err);
    return NextResponse.json({ 
      error: "Failed to update user info", 
      details: err instanceof Error ? err.message : "Unknown error" 
    }, { status: 500 });
  }
}

