import { useState, useMemo } from "react";
import PastEventCard from "./PastEventCard";
import FilterSection from "./FilterSection";

interface Event {
  event_id: number;
  event_name: string;
  event_date: string;
  duration: number;
  venue: string;
  poster: string;
  visibility: boolean;
  event_description: string;
  participants: number;
  isRegistered?: boolean;
  isPast?: boolean;
}

interface PastEventsListProps {
  events: Event[];
  registeredEvents: number[];
}

export default function PastEventsList({
  events,
  registeredEvents,
}: PastEventsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  
  const eventsPerPage = 5;

  // Get available years from events
  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(events.map(event => new Date(event.event_date).getFullYear()))
    );
    return years.sort((a, b) => b - a); // Sort descending (newest first)
  }, [events]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(event =>
        event.event_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply year filter
    if (selectedYear !== "all") {
      filtered = filtered.filter(event => 
        new Date(event.event_date).getFullYear().toString() === selectedYear
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.event_date).getTime() - new Date(a.event_date).getTime();
        case "date-asc":
          return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
        case "name-asc":
          return a.event_name.localeCompare(b.event_name);
        case "name-desc":
          return b.event_name.localeCompare(a.event_name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchTerm, selectedYear, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  // Reset page when filters change
  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const pages = [];
      const maxVisible = 5;
      
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => setCurrentPage(page as number)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600">No past events found.</p>
      </div>
    );
  }

  return (
    <div>
      <FilterSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedYear={selectedYear}
        setSelectedYear={handleFilterChange(setSelectedYear)}
        sortBy={sortBy}
        setSortBy={handleFilterChange(setSortBy)}
        availableYears={availableYears}
      />

      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600 mb-4">No events found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedYear("all");
              setSortBy("date-desc");
              setCurrentPage(1);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(startIndex + eventsPerPage, filteredEvents.length)} of {filteredEvents.length} events
            </p>
          </div>
          
          <div>
            {paginatedEvents.map(event => (
              <PastEventCard
                key={event.event_id}
                event={event}
                isRegistered={registeredEvents.includes(event.event_id)}
              />
            ))}
          </div>
          
          <Pagination />
        </>
      )}
    </div>
  );
}