"use client";
import { useRouter } from "next/navigation"; // For Next.js App Router
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import RegisteredEvents from "../../components/RegisteredEvents"; // if .tsx
// adjust path if needed







type UserData = {
  user_name: string;
  user_email: string;
  roll_no: string;
  semester: string;
  branch: string;
  college_name: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user-profile", { cache: "no-store" });
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return <p className="text-center mt-10">Loading your profile...</p>;
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-800 font-inter">
      {/* Header */}
      <div className="text-left">
        <h1 className="flex justify-start items-start gap-7 text-5xl font-bold text-[#0A4456]">
          User Profile
          <Image src="/person.svg" alt="Person Icon" width={45} height={45} />
        </h1>

        <p className="ml-[5px] mt-2 text-[15px] font-medium leading-[45px] text-[rgba(26,101,124,0.77)]">
          View all your profile details here
        </p>
      </div>

      {/* Line */}
      <div className="w-full h-[2px] bg-[rgba(124,210,253,0.75)] rounded-md relative overflow-hidden mt-2">
        <div className="absolute top-0 left-0 h-full w-1/3 bg-[#9DDDFE] rounded-full" />
      </div>

      {/* Profile Content */}
      <div className="mt-12 mx-auto max-w-[900px] flex flex-col md:flex-row justify-between items-stretch gap-10">
        {/* Left Profile Box */}
        <div className="bg-white border border-[#7CD2FDBF] rounded-md shadow-md p-6 w-full md:max-w-sm flex flex-col items-center">
          <h2 className="text-3xl font-bold text-[#0A4456]">
            {userData?.user_name || user?.name || "Your Name"}
          </h2>

          {user?.image && (
            <div className="w-36 h-36 mt-4">
              <Image
                src={user.image}
                alt="Profile picture"
                width={144}
                height={144}
                className="rounded-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Right Details Box */}
        <div className="bg-white border border-[#7CD2FDBF] rounded-md p-6 w-full max-w-lg">
          <h3 className="text-xl font-semibold text-[#0A4456] mb-4">Your Details</h3>

          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-[#1f1f1f] text-[14px] leading-[1.2] m-0 p-0">
                {userData?.user_email || user?.email || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Branch</p>
              <p className="font-medium text-[#1f1f1f] text-[14px] leading-[1.2] m-0 p-0">
                {userData?.branch || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Roll No</p>
              <p className="font-medium text-[#1f1f1f] text-[14px] leading-[1.2] m-0 p-0">
                {userData?.roll_no || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">College Name</p>
              <p className="font-medium text-[#1f1f1f] text-[14px] leading-[1.2] m-0 p-0">
                Gitam
              </p>
            </div>
            <div>
              <p className="text-gray-500">Semester</p>
              <p className="font-medium text-[#1f1f1f] text-[14px] leading-[1.2] m-0 p-0">
                {userData?.semester || "N/A"}
              </p>
            </div>

            {/* Edit Profile Button */}
            <button   onClick={() => router.push("/edit-profile")}
            className="mt-6 px-3 py-1.5 bg-[#00D0FF] text-white text-sm font-medium rounded-md flex items-center gap-2 hover:bg-[#5dcffb] transition w-fit">
              <Image src="/edit_icon.svg" alt="Edit Icon" width={18} height={18} />
              <p className="font-medium text-white">Edit Profile</p>
            </button>
          </div>
        </div>
      </div>

      <RegisteredEvents />
    </div>
  );
}
