"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Event = {
  event_id: number;
  event_name: string;
  event_date: string;
  reg_link: string;
  poster_link: string;
  description?: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => setEvents(data.events));
  }, []);

  return (
    <div className="p-8">
    ...
<div className="flex items-center justify-between mb-4">
  <h1 className="text-2xl">Events</h1>
  <div className="flex gap-2">
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      onClick={() => router.push("/add-events")}
    >
      Add Event
    </button>
    <button
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      onClick={() => router.push("/update-event")}
    >
      Update Event
    </button>
   </div>
  </div>
...
      <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(ev => (
          <li key={ev.event_id} className="border p-4 rounded shadow flex flex-col">
            <img
              src={ev.poster_link}
              alt={ev.event_name}
              className="w-full h-48 object-cover mb-2 rounded"
              onError={e => (e.currentTarget.src = "/no-image.png")}
            />
            <div className="flex-1">
              <b className="text-lg">{ev.event_name}</b>
              <div className="text-gray-600">{new Date(ev.event_date).toLocaleString()}</div>
              {ev.description && <div className="mb-2">{ev.description}</div>}
              <a
                href={ev.reg_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Register
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}