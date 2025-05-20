"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import LoginForm from "@/components/loginpage";

export default function Home() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // if we're signed in but missing profile fields, go complete-profile
  useEffect(() => {
    if (
      status === "authenticated" &&
      (!session?.user?.rollNo ||
        !session.user.semester ||
        !session.user.branch)
    ) {
      router.push("/complete-profile");
    }
  }, [session, status, router]);

  useEffect(() => {
    const checkProfile = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      // 1. Fetch profile from database
      const res = await fetch("/api/user-profile");
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const dbProfile = await res.json();

      // 2. If DB is missing any field, redirect to complete-profile
      if (
        !dbProfile.roll_no ||
        !dbProfile.semester ||
        !dbProfile.branch
      ) {
        router.push("/complete-profile");
        return;
      }

      // 3. If session is missing but DB has, poll session until updated
      if (
        !session.user?.rollNo ||
        !session.user.semester ||
        !session.user.branch
      ) {
        for (let i = 0; i < 10; i++) {
          const newSession = await update?.();
          if (
            newSession?.user?.rollNo &&
            newSession.user.semester &&
            newSession.user.branch
          ) {
            break;
          }
          await new Promise((r) => setTimeout(r, 500));
        }
      }

      setLoading(false);
    };

    if (status === "authenticated") {
      checkProfile();
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status, router, update]);

  if (loading || status === "loading") return <div>Loading…</div>;

  return (
    <>
      {session ? (
        <>
          <p className="text-xl font-bold underline">Signed in as {session.user?.name}</p>
          <p>Email: {session.user?.email}</p>
          <p>Roll No: {session.user?.rollNo}</p>
          <p>Semester: {session.user?.semester}</p>
          <p>Branch: {session.user?.branch}</p>
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full"
            />
          )}
          <button
            onClick={() => signOut()}
            style={{
              marginTop: 20,
              padding: "8px 16px",
              background: "#DB4437",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </>
      ) : (
        <LoginForm />
      )}
    </>
  );
}