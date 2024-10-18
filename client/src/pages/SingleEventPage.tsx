import { useGetEventByIdQuery } from '@/api/eventsSlice';
import { useParams } from 'react-router-dom';
import defaulEventImage from '../img/defaulEventImage.png';
import { Event } from '../misc/events';
import { useTheme } from '@/components/contextAPI/ThemeContext';
import { getThemeStyles } from '@/utils/themeUtils';

const SingleEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetEventByIdQuery(id!);
  const { theme } = useTheme();
  const { bgColor, fontColor } = getThemeStyles(theme);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading the event</div>;

  if (!data) return <div>No event data available</div>;

  const eventData = data as Event;

  return (
    <div className={`flex flex-col items-center min-h-screen ${bgColor} ${fontColor} p-8`}>
      <h1 className="text-2xl font-bold mb-4">{eventData?.name}</h1>
      <div className="flex flex-col md:flex-row items-start w-full max-w-4xl">
        <div className="flex-shrink-0 w-full md:w-1/2">
          {eventData?.images && eventData.images.length > 0 ? (
            eventData.images.map((img: string, index: number) => (
              <img key={index} src={img} alt={`Event image ${index + 1}`} className="w-full h-auto mb-4" />
            ))
          ) : (
            <img src={defaulEventImage} alt="Default event" className="w-full h-auto mb-4" />
          )}
        </div>
        <div className="flex-grow mt-4 md:mt-0 md:ml-8">
          <div className="mb-4">{eventData?.description || 'No description available'}</div>
          <div className="mb-4">
            <a href={eventData?.event_link || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {eventData?.event_link || 'No link available'}
            </a>
          </div>
          <div className="mb-4">
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
      </div>
    </div>
  );
};

export default SingleEventPage;