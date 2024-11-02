import { useState } from "react";
import { useCreateEventMutation } from "@/api/eventsSlice";
import { EventType } from "@/misc/events";
import { Button } from "@/components/ui/buttonShadcn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEventModal({
  isOpen,
  onClose,
}: CreateEventModalProps) {
  const [createEvent, { isLoading }] = useCreateEventMutation();
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: undefined as Date | undefined,
    price: 0,
    event_type: undefined as EventType | undefined,
  });

  const handleChange = (
    field: string,
    value: string | number | Date | EventType | undefined
  ) => {
    setEventData({ ...eventData, [field]: value });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const locationId = localStorage.getItem("locationId");
    const organizerId = localStorage.getItem("userId");

    if (!locationId || !organizerId) {
      toast.error("Missing location or organizer details.");
      return;
    }

    try {
      await createEvent({
        ...eventData,
        location: locationId,
        organizer: organizerId,
      }).unwrap();
      onClose();
      toast.success("Event created successfully!");
    } catch (error) {
      console.error("Failed to create event:", error);
      toast.error("Failed to create event. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            Create Event
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateEvent} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Event Name
              </Label>
              <Input
                id="name"
                value={eventData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter event name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Event Description
              </Label>
              <Textarea
                id="description"
                value={eventData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter event description"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Event Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !eventData.date && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventData.date
                      ? format(eventData.date, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={eventData.date}
                    onSelect={(date) => handleChange("date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={eventData.price}
                onChange={(e) => handleChange("price", Number(e.target.value))}
                placeholder="Enter event price"
                min={0}
                step={0.01}
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="event_type"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Event Type
              </Label>
              <Select
                onValueChange={(value) =>
                  handleChange("event_type", value as EventType)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EventType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleCreateEvent}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Creating...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
