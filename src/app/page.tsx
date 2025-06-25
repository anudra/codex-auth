"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import LoginForm from "@/components/loginpage";
import RegistrationForm from "@/components/registrationForm";

export default function Home() {
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>({});
  const [form, setForm] = useState({ rollNo: "", semester: "", branch: "", username: "", });
  const router = useRouter();

  const handleProfileSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await fetch("/api/complete-profile", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      await update?.();
      const fresh = await fetch("/api/user-profile").then(r => r.json());
      setProfile({
      rollNo: fresh.roll_no, semester: fresh.semester, branch: fresh.branch, user_name: fresh.user_name, 
      college_name: fresh.college_name, email: fresh.email, image: fresh.image, role: fresh.role,
      });
  }
  // Sync form with profile/session
  useEffect(() => {
    if (!profile) return;
    setForm({
      rollNo: profile.rollNo || "",
      semester: profile.semester || "",
      branch: profile.branch || "",
      username: profile.user_name || session?.user?.name || "",
    });
  }, [profile, session]);

  // Fetch profile and update DB with Google info if needed
  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/user-profile")
      .then((res) => res.json())
      .then(async (data) => {
        // Update DB with Google info if missing
        if (
          session?.user &&
          (data.email !== session.user.email || data.user_name !== session.user.name || data.image !== session.user.image)
        ) {
          await fetch("/api/update-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email, user_name: session.user.name, image: session.user.image,
            }),
          });
        }
        setProfile({
          rollNo: data.roll_no, semester: data.semester,
          branch: data.branch, user_name: data.user_name,
          college_name: data.college_name, email: data.email,
          image: data.image,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status, session]);

  if (status === "loading" || loading) return <div>Loading…</div>;
  if (status === "unauthenticated") return <LoginForm />;

  const incomplete = !profile.rollNo || !profile.semester || !profile.branch;
  if (incomplete) {
    return (
      <RegistrationForm
        rollNo={form.rollNo}
        semester={form.semester}
        branch={form.branch}
        username={form.username}
        collegename={profile.college_name || ""}
        error=""
        onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
        handleSubmit={handleProfileSubmit}
      />
    ); 
  }

  // Profile complete
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-md w-full rounded-xl shadow p-8">
          <h1 className="text-2xl font-bold mb-4">Welcome, {session?.user?.name}</h1>
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt="Avatar"
              width={80}
              height={80}
              className="rounded-full mb-4"
            />
          )}
          <p className="mb-1"><b>Email:</b> {session?.user?.email}</p>
          <p className="mb-1"><b>Roll No:</b> {profile.rollNo}</p>
          <p className="mb-1"><b>Semester:</b> {profile.semester}</p>
          <p className="mb-4"><b>Branch:</b> {profile.branch}</p>
          <button
            onClick={() => signOut()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Sign out
          </button>
        </div>
      </div>
  );
}