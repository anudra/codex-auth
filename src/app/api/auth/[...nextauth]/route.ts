import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

// Initialize PostgreSQL connection pool
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Needed for some managed DBs like Heroku Postgres
  },
});

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,     // Ensure these env vars are set
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase() ?? "";

      // Only allow users from the gitam.in domain
      if (!email.endsWith("@gitam.in")) {
        return false;
      }

      try {
        const query = `
          INSERT INTO USERS (
            USER_ID, USER_NAME, USER_EMAIL, PROFILE_PIC, ROLL_NO, SEMESTER, BRANCH, COLLEGE_NAME
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (USER_EMAIL) DO NOTHING
        `;

        const values = [
          uuidv4(),
          user.name ?? "",
          email,
          user.image ?? "",
          null,    // ROLL_NO
          null,    // SEMESTER
          null,    // BRANCH
          "GITAM",
        ];

        await pool.query(query, values);
      } catch (error) {
        console.error("Failed to insert user:", error);
        return false;
      }

      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };