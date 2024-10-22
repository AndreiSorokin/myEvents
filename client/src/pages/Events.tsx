import { useGetEventsQuery } from '@/api/eventsSlice';
import defaulEventImage from '../img/defaulEventImage.png';
import { Link } from 'react-router-dom';
import { getThemeStyles } from '@/utils/themeUtils';
import { useTheme } from '@/components/contextAPI/ThemeContext';
import { useState } from 'react';

const Events = () => {

   const { theme } = useTheme();
   const { bgColor, fontColor } = getThemeStyles(theme);
   const [searchItem, setSearchItem ] = useState('');

   const { data, error, isLoading } = useGetEventsQuery({
      limit: 10,
      page: 1,
      searchQuery: searchItem
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