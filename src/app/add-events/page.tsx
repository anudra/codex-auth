"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddEventPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [form, setForm] = useState({
    event_name: "",
    event_date: "",
    reg_link: "",
    poster: "",
    duration: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/add-events", { method: "POST" })
      .then(res => res.json())
      .then(data => setIsAdmin(data.success === true));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        duration: Number(form.duration),
      }),
    });
    if (res.ok) {
      setMessage("Event added!");
      setTimeout(() => router.push("/events"), 1000);
    } else {
      setMessage("Failed to add event.");
    }
  };

  if (isAdmin === null) {
    return <div className="p-8">Checking admin status...</div>;
  }

  if (!isAdmin) {
    return <div className="p-8 text-red-600 font-bold">Unauthorized: Only admins can add events.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Add Event</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="event_name"
          placeholder="Event Name"
          value={form.event_name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="event_date"
          type="datetime-local"
          value={form.event_date}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="reg_link"
          placeholder="Registration Link"
          value={form.reg_link}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="poster"
          placeholder="Poster Image Link"
          value={form.poster}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="duration"
          placeholder="Duration (minutes)"
          type="number"
          value={form.duration}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Add Event
        </button>
        {message && <div className="mt-2">{message}</div>}
      </form>
    </div>
  );
}