import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateLocationMutation } from "@/api/locationsSlice";
import { Button } from "@/components/ui/buttonShadcn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import {
  MapPin,
  Globe,
  Building,
  Hash,
  Landmark,
  Home,
  Navigation,
  X,
} from "lucide-react";

interface CreateLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationCreated: (locationId: string) => void;
}

export default function CreateLocationModal({
  isOpen,
  onClose,
  onLocationCreated,
}: CreateLocationModalProps) {
  const navigate = useNavigate();
  const [createLocation, { isLoading }] = useCreateLocationMutation();
  const [locationData, setLocationData] = useState({
    country: "",
    city: "",
    post_code: "",
    district: "",
    ward: "",
    street: "",
    address_number: "",
  });

  const handleCloseAndNavigate = () => {
    onClose();
    navigate("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationData({
      ...locationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createLocation({
        country: locationData.country,
        city: locationData.city,
        ...(locationData.post_code && { post_code: locationData.post_code }),
        ...(locationData.district && { district: locationData.district }),
        ...(locationData.ward && { ward: locationData.ward }),
        ...(locationData.street && { street: locationData.street }),
        ...(locationData.address_number && {
          address_number: locationData.address_number,
        }),
      }).unwrap();

      if (response.id) {
        toast.success("Location created successfully!");
        onLocationCreated(response.id);
        onClose();
      }
    } catch (err) {
      const errorMessage =
        err &&
        typeof err === "object" &&
        "data" in err &&
        typeof err.data === "object" &&
        err.data !== null &&
        "message" in err.data
          ? (err.data as { message: string }).message
          : "Failed to create location";

      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            Create Event Location
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleCloseAndNavigate}
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Country
                </Label>
                <div className="relative">
                  <Globe
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="country"
                    name="country"
                    value={locationData.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="city"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  City
                </Label>
                <div className="relative">
                  <Building
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="city"
                    name="city"
                    value={locationData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="post_code"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Post Code
                </Label>
                <div className="relative">
                  <Hash
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="post_code"
                    name="post_code"
                    value={locationData.post_code}
                    onChange={handleChange}
                    placeholder="Enter post code"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="district"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  District
                </Label>
                <div className="relative">
                  <Landmark
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="district"
                    name="district"
                    value={locationData.district}
                    onChange={handleChange}
                    placeholder="Enter district"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="ward"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Ward
                </Label>
                <div className="relative">
                  <Home
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="ward"
                    name="ward"
                    value={locationData.ward}
                    onChange={handleChange}
                    placeholder="Enter ward"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="street"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Street
                </Label>
                <div className="relative">
                  <Navigation
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="street"
                    name="street"
                    value={locationData.street}
                    onChange={handleChange}
                    placeholder="Enter street"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="address_number"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Address Number
                </Label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="address_number"
                    name="address_number"
                    value={locationData.address_number}
                    onChange={handleChange}
                    placeholder="Enter address number"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleCloseAndNavigate}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Creating...
              </>
            ) : (
              "Create Location"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
