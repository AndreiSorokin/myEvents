import { useGetEventsQuery } from '@/api/eventsSlice';

import defaulEventImage from '../img/defaulEventImage.png'

const Events = () => {
   const { data, error, isLoading } = useGetEventsQuery();

   if (isLoading) return <div>Loading...</div>;

   if (error) return <div>Error loading events</div>;

   console.log(data);

   return (
      <div>
         <ul>
            {data?.events.map(e => (
               <li key={e.id}>
                  <h3>{e.name}</h3>
                  <img src={e.images[0] || defaulEventImage}/>
                  <div>{e.organizer.name}</div>
                  <div>{e.summary}</div>
                  <br/>
               </li>
            ))}
         </ul>
      </div>
   )
}

export default Events