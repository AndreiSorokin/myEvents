// CreateEventPage.tsx
import { useState } from "react";
import CreateLocationModal from "@/components/createEvent/CreateLocationModal";
import CreateEventModal from "@/components/createEvent/CreateEventModal";

export default function CreateEventPage() {
  const [isLocationModalOpen, setLocationModalOpen] = useState(true);
  const [isEventModalOpen, setEventModalOpen] = useState(false);

  const handleLocationCreated = () => {
    setLocationModalOpen(false);
    setEventModalOpen(true);
  };

  return (
    <div>
      <CreateLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onLocationCreated={handleLocationCreated}
      />
      <CreateEventModal
        isOpen={isEventModalOpen}
        onClose={() => setEventModalOpen(false)}
      />
    </div>
  );
}
