import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { Child, LocationData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Navigation, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const LocationPage = () => {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch children data
  const { data: childrenData, isLoading: childrenLoading } = useQuery({
    queryKey: ["/api/children"],
    onSuccess: (data) => {
      if (data && data.length > 0 && !selectedChild) {
        setSelectedChild(data[0]);
      }
    },
  });

  // Fetch location data for the selected child
  const { data: locationData, isLoading: locationLoading, refetch } = useQuery({
    queryKey: ["/api/location", selectedChild?.id],
    enabled: !!selectedChild,
  });

  const handleRefreshLocation = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Location updated",
        description: "The location data has been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Failed to update location",
        description: "There was a problem refreshing the location data.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const location: LocationData = locationData || {
    name: "Oak Hill School",
    latitude: 37.7749,
    longitude: -122.4194,
    arrivalTime: "8:30 AM",
  };

  return (
    <MainLayout title="Location Tracking">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Child Location</h2>
          <Button
            onClick={handleRefreshLocation}
            disabled={isRefreshing}
            className="inline-flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {isRefreshing ? "Refreshing..." : "Refresh Location"}
          </Button>
        </div>

        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle>Current Location</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">{location.name}</h3>
                <p className="text-sm text-gray-500">
                  Since {location.arrivalTime}
                </p>
              </div>
            </div>

            <div className="bg-gray-200 rounded-lg h-96 mb-4 flex items-center justify-center text-center p-6">
              <div>
                <Navigation className="h-12 w-12 mx-auto text-primary mb-2" />
                <p className="text-gray-700">
                  Map view would be displayed here, showing the child's current
                  location at{" "}
                  <strong>
                    {location.latitude.toFixed(6)},{" "}
                    {location.longitude.toFixed(6)}
                  </strong>
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-600">
                <p>
                  <strong>Latitude:</strong> {location.latitude.toFixed(6)}
                </p>
                <p>
                  <strong>Longitude:</strong> {location.longitude.toFixed(6)}
                </p>
              </div>
              <p className="text-gray-600">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle>Location History</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-4 pb-4 border-b border-gray-100">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Oak Hill School</h4>
                  <p className="text-xs text-gray-500">8:30 AM - Now</p>
                  <p className="text-sm text-gray-700 mt-1">Current location</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 pb-4 border-b border-gray-100">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Home</h4>
                  <p className="text-xs text-gray-500">7:00 AM - 8:15 AM</p>
                  <p className="text-sm text-gray-700 mt-1">Morning routine</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Home</h4>
                  <p className="text-xs text-gray-500">Yesterday, 3:30 PM - 7:00 AM</p>
                  <p className="text-sm text-gray-700 mt-1">Overnight</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default LocationPage;
