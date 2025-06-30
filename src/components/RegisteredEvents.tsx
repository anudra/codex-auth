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
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showingAll, setShowingAll] = useState(false);

  const INITIAL_DISPLAY_COUNT = 3;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/event-registration");
        const data = await res.json();
        const events = data.events || [];
        
        setAllEvents(events);
        // Show only first 3 events initially
        setDisplayedEvents(events.slice(0, INITIAL_DISPLAY_COUNT));
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleLoadMore = () => {
    setDisplayedEvents(allEvents); // Show ALL events
    setShowingAll(true);
  };

  const hasMoreToShow = !showingAll && allEvents.length > INITIAL_DISPLAY_COUNT;

  if (loading) {
    return <p className="mt-10 text-center">Loading registered events...</p>;
  }

  if (!allEvents.length) {
    return <p className="mt-10 text-center">You haven't registered for any events yet.</p>;
  }

  return (
    <div className="mt-16 border border-blue-200 rounded-md p-6 shadow-md max-w-[900px] mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-[#0A4456]">
        Registered Events 
      </h2>
      
      <table className="w-full text-left text-sm table-auto">
        <thead className="border-b border-gray-300 text-[#0A4456] font-semibold">
          <tr>
            <th className="pb-2">Event name</th>
            <th className="pb-2">Date & Time</th>
            <th className="pb-2">Venue</th>
            <th className="pb-2">Chat link</th>
          </tr>
        </thead>
        <tbody>
          {displayedEvents.map(event => (
            <tr key={event.event_id} className="border-t border-gray-200">
              <td className="py-2">{event.event_name}</td>
              <td className="py-2">
                {new Date(event.event_date).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </td>
              <td className="py-2">{event.venue}</td>
             <td className="py-2">
  {event.whatsapp_link ? (
    <a 
      href={event.whatsapp_link} 
      className="text-blue-600 underline hover:text-blue-800" 
      target="_blank" 
      rel="noreferrer"
      onClick={(e) => {
     
        // Validate WhatsApp link format
        if (!event.whatsapp_link.includes('whatsapp.com') && 
            !event.whatsapp_link.includes('wa.me')) {
          e.preventDefault();
          alert("Invalid WhatsApp link format");
        }
      }}
    >
      Join WhatsApp
    </a>
  ) : (
    <span className="text-gray-400">No link available</span>
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Load More Button - Shows only if there are more than 3 events */}
      {hasMoreToShow && (
        <div className="text-center mt-4">
          <button 
            onClick={handleLoadMore}
            className="px-4 py-2 border border-gray-400 rounded-md text-sm hover:bg-gray-100 transition"
          >
            Load More ⬇ ({allEvents.length - INITIAL_DISPLAY_COUNT} more events)
          </button>
        </div>
      )}

      {/* Optional: Show less button if showing all */}
      {showingAll && allEvents.length > INITIAL_DISPLAY_COUNT && (
        <div className="text-center mt-2">
          <button 
            onClick={() => {
              setDisplayedEvents(allEvents.slice(0, INITIAL_DISPLAY_COUNT));
              setShowingAll(false);
            }}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Show Less ⬆
          </button>
        </div>
      )}
    </div>
  );
}