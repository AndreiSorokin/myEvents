import { useGetEventsQuery } from '@/api/eventsSlice';
import Map from '../components/map/Map';

const Map = () => {
  const { data, error, isLoading } = useGetEventsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading events</div>;

  return (
    <div>
      <h1>Event Map</h1>
      {data && <Map events={data.events} />}
    </div>
  );
};

export default Map;