import { useGetEventsQuery } from '@/api/eventsSlice';
import EventMap from '../components/map/EventMap';

const EventMapPage  = () => {
  const { data, error, isLoading } = useGetEventsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading events</div>;

  return (
    <div>
      <h1>Event Map</h1>
      {data && <EventMap events={data.events} />}
    </div>
  );
};

export default EventMapPage;