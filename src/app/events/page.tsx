"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Event = {
  event_id: number;
  event_name: string;
  event_description?: string;
  event_date: string;
  reg_link: string;
  poster_link: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [downloadId, setDownloadId] = useState<string>(""); // always keep as string
  const [showDownloader, setShowDownloader] = useState<boolean>(false);
  const router = useRouter();

  // Fetch events
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data.events));
  }, []);

  // Fetch user's registered event ids
  useEffect(() => {
    fetch("/api/event-registration")
      .then((res) => res.json())
      .then((data) => setRegisteredEvents(data.eventIds || []));
  }, []);

  // Register handle function
  const handleRegister = async (event_id: number, event_name: string) => {
    const res = await fetch("/api/event-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_id, event_name }),
    });
    if (res.status === 400) {
      alert("You are already registered for this event.");
    } else if (res.ok) {
      setRegisteredEvents((prev) => [...prev, event_id]);
      alert("Registration successful!");
    } else {
      alert("Registration failed. Please try again.");
    }
  };

  const handleDownload = async () => {
  if (!downloadId) return
  try {
    const ev = events.find(e => e.event_id.toString() === downloadId)!
    const res = await fetch(
      `/api/export-registration?event_id=${downloadId}`
    )
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${ev.event_name}_registrations.xlsx`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
    } catch (err) {
    alert('Download failed')
    } finally {
      setShowDownloader(false);
      setDownloadId("");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Events</h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => router.push("/add-events")}
          >
            Add Event
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => router.push("/update-event")}
          >
            Update Event
          </button>

          {!showDownloader ? (
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              onClick={() => setShowDownloader(true)}
            >
              Download Registrations
            </button>
          ) : (
            <div className="flex gap-2 items-center">
              <select
                className="border px-2 py-2 rounded bg-white text-black"
                value={downloadId}
                onChange={(e) => setDownloadId(e.target.value)}
              >
                <option value="">Choose event…</option>
                {events.map((ev) => (
                  <option key={ev.event_id} value={ev.event_id.toString()}>
                    {ev.event_name}
                  </option>
                ))}
              </select>
              <button
                className="bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={handleDownload}
                disabled={!downloadId}
              >
                Go
              </button>
              <button
                className="text-gray-600 px-2 py-2"
                onClick={() => {
                  setShowDownloader(false);
                  setDownloadId("");
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
      <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((ev) => (
          <li
            key={ev.event_id}
            className="border p-4 rounded shadow flex flex-col"
          >
            <img
              src={ev.poster_link}
              alt={ev.event_name}
              className="w-full h-48 object-cover mb-2 rounded"
              onError={(e) => (e.currentTarget.src = "/no-image.png")}
            />
            <div className="flex-1">
              <b className="text-lg">{ev.event_name}</b>
              <div className="text-gray-600">
                {new Date(ev.event_date).toLocaleString()}
              </div>
              {ev.event_description && (
                <div className="mb-2">{ev.event_description}</div>
              )}
              {registeredEvents.includes(ev.event_id) ? (
                <p className="text-gray-500 underline">Registered</p>
              ) : (
                <button
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                  onClick={() => handleRegister(ev.event_id, ev.event_name)}
                >
                  Register
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}