import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGetEventsQuery } from "@/api/eventsSlice";
import defaultEventImage from "../img/defaulEventImage.png";
import { EventType } from "@/misc/events";
import { SearchIcon, CalendarIcon, XIcon } from "@heroicons/react/outline";

const Events = () => {
  const [searchItem, setSearchItem] = useState("");
  const [selectedEventType, setSelectedEventType] = useState<EventType | "">(
    ""
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useGetEventsQuery({
    limit: 12,
    page,
    searchQuery: searchItem,
    eventTypeQuery: selectedEventType || undefined,
    date: selectedDate ? selectedDate.toISOString() : undefined,
    minPrice: minPrice !== "" ? Number(minPrice) : undefined,
    maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [searchItem, selectedEventType, selectedDate, minPrice, maxPrice]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen dark:text-white">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen dark:text-white">
        Error loading events
      </div>
    );

  const filteredEvents = data?.events.filter((e) =>
    e.name.toLowerCase().includes(searchItem.toLowerCase())
  );
  
  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Discover Events</h1>
        </div>

        {/* Search and Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value as EventType)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Event Types</option>
            {Object.values(EventType).map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholderText="Select a date"
            />
            <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XIcon className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min price"
              className="w-1/2 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max price"
              className="w-1/2 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents?.map((e) => (
            <Link key={e.id} to={`/events/${e.id}`} className="group">
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform group-hover:scale-105">
                <div className="relative">
                  <img
                    src={e.images[0] || defaultEventImage}
                    alt={e.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-lg font-semibold text-white line-clamp-1">
                      {e.name}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Organizer:{" "}
                    {typeof e.organizer === "object"
                      ? e.organizer.name
                      : e.organizer}
                  </p>
                  <p className="text-sm mb-2 line-clamp-2">{e.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {e.price} €
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(e.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-600 transition-colors duration-300"
          >
            Previous
          </button>
          <span className="text-lg font-semibold">{page}</span>
          <button
            onClick={handleNextPage}
            disabled={!data || data.events.length < 12}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-600 transition-colors duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Events;
