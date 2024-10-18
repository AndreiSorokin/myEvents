import { useGetEventByIdQuery } from '@/api/eventsSlice';
import { useParams } from 'react-router-dom';
import defaulEventImage from '../img/defaulEventImage.png';
import { Event } from '../misc/events';

const SingleEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetEventByIdQuery(id!);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading the event</div>;

  if (!data) return <div>No event data available</div>;

  const eventData = data as Event;

  return (
    <div>
      <h1>{eventData?.name}</h1>
      <div>
        {eventData?.images && eventData.images.length > 0 ? (
          eventData.images.map((img: string, index: number) => (
            <img key={index} src={img} alt={`Event image ${index + 1}`} />
          ))
        ) : (
          <img src={defaulEventImage} alt="Default event" />
        )}
      </div>
      <div>{eventData?.description || 'No description available'}</div>
      <div>
        <a href={eventData?.event_link || '#'} target="_blank" rel="noopener noreferrer">
          {eventData?.event_link || 'No link available'}
        </a>
      </div>
      <div>
        {eventData?.location ? (
          <>
            <div>Country: {eventData.location.country}</div>
            <div>City: {eventData.location.city}</div>
            <div>Post Code: {eventData.location.post_code}</div>
            <div>Latitude: {eventData.location.latitude}</div>
            <div>Longitude: {eventData.location.longitude}</div>
          </>
        ) : (
          'No location available'
        )}
      </div>
      <div>{eventData?.price !== undefined ? `$${eventData.price}` : 'Price not available'}</div>
    </div>
  );
};

export default SingleEventPage;