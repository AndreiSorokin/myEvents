import { useGetEventsQuery } from '@/api/eventsSlice';

const Events = () => {
   const { data: events, error, isLoading } = useGetEventsQuery();

   if (isLoading) return <div>Loading...</div>;

   if (error) return <div>Error loading events</div>;

   console.log(events);

   return (
      <div>
         
      </div>
   )
}

export default Events
