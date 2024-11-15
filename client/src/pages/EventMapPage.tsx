import { useGetEventsQuery } from "@/api/eventsSlice";
import EventMap from "../components/map/EventMap";
import { useTheme } from "@/components/contextAPI/ThemeContext";
import { getThemeStyles } from "@/utils/themeUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/buttonShadcn";
import { CalendarDays, MapPin, Users } from "lucide-react";

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

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        Error loading events
      </div>
    );

  return (
    <div className={`${bgColor} ${fontColor} min-h-screen`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Event Map</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
            {data && (
              <EventMap
                events={data.events.map(event => ({
                  ...event,
                  location: typeof event.location === "string"
                    ? { city: "", country: "", latitude: undefined, longitude: undefined, post_code: "" } // Default empty Location
                    : event.location,
                }))}
              />
            )}

            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Event List</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[550px] pr-4">
                {data &&
                  data.events.map((event) => (
                    <Card key={event.id} className="mb-4">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{event.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <MapPin className="mr-2 h-4 w-4" />
                          {event.location.toString()}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Users className="mr-2 h-4 w-4" />
                          {event.attendees} attendees
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventMapPage;
