import { useGetEventsQuery } from '@/api/eventsSlice';

import defaulEventImage from '../img/defaulEventImage.png'
import { Link } from 'react-router-dom';

const Events = () => {
   const { data, error, isLoading } = useGetEventsQuery();

   if (isLoading) return <div>Loading...</div>;

   if (error) return <div>Error loading events</div>;

   console.log(data);

   return (
      <div className="flex justify-center">
         <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-24">
            {data?.events.map(e => (
               <li key={e.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <Link to={`/events/${e.id}`}>
                     <img src={e.images[0] || defaulEventImage} alt={e.name} className="w-full h-48 object-cover"/>
                     <div className="p-4">
                        <h3 className="text-lg font-semibold">{e.name}</h3>
                        <div className="text-sm text-gray-600">Organazer: {e.organizer.name}</div>
                        <div className="mt-2 text-gray-800">{e.summary}</div>
                     </div>
                  </Link>
               </li>
            ))}
         </ul>
      </div>
   );
}

export default Events