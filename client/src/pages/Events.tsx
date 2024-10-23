import { Link } from 'react-router-dom';
import { useState } from 'react';
import DatePicker from'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useGetEventsQuery } from '@/api/eventsSlice';
import defaulEventImage from '../img/defaulEventImage.png';
import { getThemeStyles } from '@/utils/themeUtils';
import { useTheme } from '@/components/contextAPI/ThemeContext';
import { EventType } from '@/misc/events';

const Events = () => {

   const { theme } = useTheme();
   const { bgColor, fontColor } = getThemeStyles(theme);
   const [searchItem, setSearchItem ] = useState('');
   const [selectedEventType, setSelectedEventType] = useState<EventType | ''>('');
   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
   const [minPrice, setMinPrice ] = useState<string>("");
   const [maxPrice, setMaxPrice ] = useState<string>("");

   const { data, error, isLoading } = useGetEventsQuery({
      limit: 10,
      page: 1,
      searchQuery: searchItem,
      eventTypeQuery: selectedEventType || undefined,
      date: selectedDate ? selectedDate.toISOString() : undefined,
      minPrice: minPrice !== '' ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== '' ? Number(maxPrice) : undefined
   });

   const shadowClass = theme === 'dark' ? 'shadow-lg shadow-gray-700' : 'shadow-md shadow-gray-300';

   if (isLoading) return <div>Loading...</div>;

   if (error) return <div>Error loading events</div>;

   console.log(data);

   const filteredEvents = data?.events.filter(e => 
      e.name.toLowerCase().includes(searchItem.toLowerCase())
   )

   return (
      <div className={`flex flex-col items-center ${bgColor} ${fontColor}`}>
         <input
            type="text"
            placeholder="Search events..."
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded-md"
         />
         <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value as EventType)}
            className="mb-4 p-2 border border-gray-300 rounded-md"
         >
            <option value="">All Event Types</option>
            {Object.values(EventType).map((type) => (
               <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
               </option>
            ))}
         </select>
         <div className="flex items-center mb-4">
            <DatePicker
               selected={selectedDate}
               onChange={(date: Date | null) => setSelectedDate(date)}
               className="p-2 border border-gray-300 rounded-md"
               placeholderText="Select a date"
            />
            <button
               onClick={() => setSelectedDate(null)}
               className="ml-2 p-2 bg-red-500 text-white rounded-md"
            >
               Reset Date
            </button>
         </div>
         <div>
            Price:
            <input 
               type="number"
               placeholder="min price"
               className="mb-4 p-2 border border-gray-300 rounded-md"
               value={minPrice}
               onChange={e => setMinPrice(e.target.value)}
            />
            <input 
               type="number"
               placeholder="max price"
               className="mb-4 p-2 border border-gray-300 rounded-md"
               value={maxPrice}
               onChange={e => setMaxPrice(e.target.value)}
            />
         </div>
         <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-24">
            {filteredEvents?.map(e => (
               <li key={e.id} className={`rounded-lg overflow-hidden ${bgColor} ${fontColor} ${shadowClass}`}>
                  <Link to={`/events/${e.id}`}>
                     <img src={e.images[0] || defaulEventImage} alt={e.name} className="w-full h-48 object-cover"/>
                     <div className="p-4">
                        <h3 className="text-lg font-semibold">{e.name}</h3>
                        <div className="text-sm">Organizer: {e.organizer.name}</div>
                        <div className="mt-2">{e.description}</div>
                        <div className="mt-2">{e.price} €</div>
                     </div>
                  </Link>
               </li>
            ))}
         </ul>
      </div>
   );
}

export default Events;