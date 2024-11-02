import { useTheme } from "@/components/contextAPI/ThemeContext";
import { getThemeStyles } from "@/utils/themeUtils";
import { Button } from "@/components/ui/buttonShadcn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarDays, MapPin, Share2, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const { theme } = useTheme();
  const { bgColor, fontColor } = getThemeStyles(theme);

  return (
    <div className={`min-h-screen ${bgColor} ${fontColor}`}>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-6">
          Discover Amazing Events Near You
        </h1>
        <p className="text-xl mb-8">
          Connect, Explore, and Create Unforgettable Experiences
        </p>
        <Button className="bg-[#4A43EC] hover:bg-[#3f39c8] text-white">
          Get Started
        </Button>
      </section>

      {/* Upcoming Events Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold">Events for you</h2>
          <Link to="/events">
            <Button variant="outline" className="flex items-center">
              See All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((event) => (
            <Card key={event}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="mr-2" />
                  Event {event}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Join us for an exciting event filled with fun and
                  entertainment!
                </p>
                <Button variant="outline">Learn More</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Invite Friends Section */}
      <section className="container mx-auto px-4 py-16 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Invite Your Friends</h2>
          <p className="mb-8">
            Share the excitement with your friends and make your events even
            more memorable!
          </p>
          <div className="flex gap-4 justify-center">
            <Input placeholder="Enter friend's email" className="max-w-xs" />
            <Button className="bg-white text-primary hover:bg-gray-100">
              <Share2 className="mr-2" />
              Invite
            </Button>
          </div>
        </div>
      </section>

      {/* Events Nearby Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold">Events Nearby You</h2>
          <Link to="/map">
            <Button variant="outline" className="flex items-center">
              See All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((event) => (
            <Card key={event}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2" />
                  Local Event {event}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Discover exciting events happening right in your neighborhood!
                </p>
                <Button variant="outline">View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-semibold mb-6">Ready to Join the Fun?</h2>
        <p className="text-xl mb-8">
          Create your account now and start exploring amazing events!
        </p>
        <Button className="bg-[#4A43EC] hover:bg-[#3f39c8] text-white">
          <Users className="mr-2" />
          Sign Up Now
        </Button>
      </section>
    </div>
  );
};

export default LandingPage;
