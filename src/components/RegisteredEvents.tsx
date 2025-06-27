"use client";
import { useEffect, useState } from "react";

type Event = {
  event_id: string;
  event_name: string;
  event_date: string;
  venue: string;
  whatsapp_link: string;
};

export default function RegisteredEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/event-registration"); // adjust this path if needed
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="mt-10 text-center">Loading registered events...</p>;
  }

  if (!events.length) {
    return <p className="mt-10 text-center">You haven't registered for any events yet.</p>;
  }

  return (
    <div className="mt-16 border border-blue-200 rounded-md p-6 shadow-md max-w-[900px] mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-[#0A4456]">Registered Events</h2>
      <table className="w-full text-left text-sm table-auto">
        <thead className="border-b border-gray-300 text-[#0A4456] font-semibold">
          <tr>
            <th className="pb-2">Event name</th>
            <th className="pb-2">Date&amp;Time</th>
            <th className="pb-2">Venue</th>
            <th className="pb-2">Chat link</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.event_id} className="border-t border-gray-200">
              <td className="py-2">{event.event_name}</td>
              <td className="py-2">{new Date(event.event_date).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}</td>
              <td className="py-2">{event.venue}</td>
              <td className="py-2">
                <a href={event.whatsapp_link} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                  Join whatsapp
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center mt-4">
        <button className="px-4 py-2 border border-gray-400 rounded-md text-sm hover:bg-gray-100 transition">
          Load More ⬇
        </button>
      </div>
    </div>
  );
}
