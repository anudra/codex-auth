"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Avatar selector component
const avatars = [
  "https://i.ibb.co/yF6QtjyR/vibrent-1.png",
  "https://i.ibb.co/G4zS9T16/upstream-2.png",
  "https://i.ibb.co/1YjKHc71/upstream-13.png",
  "https://i.ibb.co/GfrVGPqg/upstream-11.png",
  "https://i.ibb.co/FLnq8K8m/bluey-2.png",
  "https://i.ibb.co/XfKjQC3r/bluey-1.png",
  "https://i.ibb.co/SDzYjVxH/toon-9.png",
  "https://i.ibb.co/gLc6JqkR/toon-10.png",
];

function AvatarSelector({ onSelect }: { onSelect: (url: string) => void }) {
  return (
    <div className="grid grid-cols-4 gap-4 bg-white p-4 border border-[#7CD2FDBF] rounded-md shadow-md mt-4 max-w-md mx-auto">
      {avatars.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Avatar ${index + 1}`}
          onClick={() => onSelect(url)}
          className="w-20 h-20 rounded-full object-cover cursor-pointer border-2 hover:border-blue-500 transition"
        />
      ))}
    </div>
  );
}

export default function EditProfile() {
  const [formData, setFormData] = useState({
    user_email: "",
    user_name: "",
    roll_no: "",
    semester: "",
    branch: "",
    college_name: "",
    profile_pic: "https://i.ibb.co/jvKpHS30/default.jpg", // default
  });

  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/user-profile", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          ...data,
          profile_pic: data.profile_pic || "avater/default.svg",
        }));
      } catch (err) {
        console.error("Failed to fetch profile data", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const updatedData = {
        user_name: formData.user_name,
        roll_no: formData.roll_no,
        semester: formData.semester,
        branch: formData.branch,
        college_name: formData.college_name,
        profile_pic: formData.profile_pic,
      };

      const res = await fetch("/api/edit-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Update failed");
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };

  const handleAvatarSelect = (url: string) => {
    setFormData((prev) => ({ ...prev, profile_pic: url }));
    setShowAvatarSelector(false);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-white font-inter">
      <div className="text-left mb-6">
        <h1 className="text-4xl font-bold text-[#0A4456] flex items-center gap-2">
          Edit Profile
          <Image src="/person.svg" width={28} height={28} alt="Edit" />
        </h1>
        <p className="text-[15px] font-medium text-[rgba(26,101,124,0.77)] mt-1">
          Edit all your profile details here
        </p>
      </div>

      <div className="w-full h-[2px] bg-[rgba(124,210,253,0.75)] rounded-md mb-8" />

      <div className="bg-white border border-[#7CD2FDBF] rounded-md shadow-md p-6 max-w-4xl mx-auto">
        <div className="flex justify-center relative mb-6 w-[120px] mx-auto">
          <Image
            src={formData.profile_pic}
            alt="Avatar"
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
          <button
            type="button"
            onClick={() => setShowAvatarSelector((prev) => !prev)}
            className="absolute top-[82%] left-[82%] -translate-x-1/2 -translate-y-1/2 bg-[#00D0FF] hover:bg-[#1ecfff] transition border-2 border-white p-1 rounded-full shadow-md group"
            title="Edit Photo"
          >
            <Image
              src="/edit_icon.svg"
              alt="Edit Icon"
              width={22}
              height={22}
              className="group-hover:scale-110 transition"
            />
          </button>
        </div>

        {showAvatarSelector && <AvatarSelector onSelect={handleAvatarSelect} />}

        <div className="text-sm text-[#1f1f1f] mt-6">
          <h3 className="text-lg font-semibold text-[#0A4456] mb-4 underline underline-offset-4">
            Your Details
          </h3>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="text-gray-500">Email ID :</label>
              <input
                type="email"
                name="user_email"
                value={formData.user_email}
                disabled
                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-gray-500">Semester :</label>
              <input
                type="text"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-white"
              />
            </div>
            <div>
              <label className="text-gray-500">Name :</label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-white"
              />
            </div>
            <div>
              <label className="text-gray-500">Branch :</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-white"
              />
            </div>
            <div>
              <label className="text-gray-500">Roll No :</label>
              <input
                type="text"
                name="roll_no"
                value={formData.roll_no}
                onChange={handleChange}
                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-white"
              />
            </div>
            <div>
              <label className="text-gray-500">College Name :</label>
              <input
                type="text"
                name="college_name"
                value={formData.college_name}
                onChange={handleChange}
                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-white"
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#00D0FF] hover:bg-[#5dcffb] transition text-white text-sm font-medium rounded-md flex items-center gap-2"
            >
              <Image src="/save.svg" alt="Save" width={18} height={18} />
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
