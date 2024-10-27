import { useGetEventsQuery } from "@/api/eventsSlice";
import EventMap from "../components/map/EventMap";
import { useTheme } from "@/components/contextAPI/ThemeContext";
import { getThemeStyles } from "@/utils/themeUtils";

const EventMapPage = () => {
  const { data, error, isLoading } = useGetEventsQuery({
    limit: 1000,
    page: 1,
    searchQuery: "",
    eventTypeQuery: undefined,
    date: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  });
  const { theme } = useTheme();
  const { bgColor, fontColor } = getThemeStyles(theme);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading events</div>;

  return (
    <div className={`${bgColor} ${fontColor}`}>
      <h1>Event Map</h1>
      {data && <EventMap events={data.events} />}
    </div>
  );
};

export default EventMapPage;
