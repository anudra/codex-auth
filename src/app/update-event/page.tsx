"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
type Event = {
  event_id: string;
  event_name: string;
  event_date: string;
  duration: number;
  reg_link: string;
  poster: string;
  visibility?: boolean;
};

export default function UpdateEventPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [eventData, setEventData] = useState<Partial<Event>>({});
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Check admin and fetch events for dropdown
  useEffect(() => {
    fetch("/api/add-events", { method: "POST" })
      .then(res => res.json())
      .then(data => setIsAdmin(data.success === true));
    fetch("/api/update-event")
      .then(res => res.json())
      .then(data => setEvents(data.events));
  }, []);

  // Fetch event details when dropdown changes
  useEffect(() => {
    if (selectedId) {
      fetch("/api/update-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: selectedId }),
      })
        .then(res => res.json())
        .then(data => setEventData(data.event));
    } else {
      setEventData({});
    }
  }, [selectedId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/update-event", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...eventData, event_id: selectedId, duration: Number(eventData.duration) }),
    });
    if (res.ok) {
      setMessage("Event updated!");
      setTimeout(() => router.push("/events"), 1000);
    } else {
      setMessage("Failed to update event.");
    }
  };

  if (isAdmin === null) return <div className="p-8">Checking admin status...</div>;
  if (!isAdmin) return <div className="p-8 text-red-600 font-bold">Unauthorized: Only admins can update events.</div>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Update Event</h1>
      <label className="block mb-2 font-semibold">Select Event:</label>
      <select
        className="border p-2 rounded mb-6 w-full text-black bg-white"
        value={selectedId}
        onChange={e => setSelectedId(e.target.value)}
      >
        <option value="">-- Select an event --</option>
        {events.map(ev => (
          <option key={ev.event_id} value={ev.event_id}>
            {ev.event_name}
          </option>
        ))}
      </select>

     {selectedId && eventData && (
  <form onSubmit={handleUpdate} className="flex flex-col gap-4">
    <input
      name="event_name"
      placeholder="Event Name"
      value={eventData.event_name || ""}
      onChange={handleChange}
      required
      className="border p-2 rounded"
    />
    <input
      name="event_date"
      type="datetime-local"
      value={eventData.event_date ? eventData.event_date.slice(0, 16) : ""}
      onChange={handleChange}
      required
      className="border p-2 rounded"
    />
    <input
      name="reg_link"
      placeholder="Registration Link"
      value={eventData.reg_link || ""}
      onChange={handleChange}
      required
      className="border p-2 rounded"
    />
    <input
      name="poster"
      placeholder="Poster Image Link"
      value={eventData.poster || ""}
      onChange={handleChange}
      required
      className="border p-2 rounded"
    />
    <input
      name="duration"
      placeholder="Duration (minutes)"
      type="number"
      value={eventData.duration || ""}
      onChange={handleChange}
      required
      className="border p-2 rounded"
    />
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        name="visibility"
        checked={eventData.visibility ?? true}
        onChange={e => setEventData({ ...eventData, visibility: e.target.checked })}
      />
      Event Visibility
    </label>
    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
      Update Event
    </button>
    {message && <div className="mt-2">{message}</div>}
  </form>
)}
    </div>
  );
}