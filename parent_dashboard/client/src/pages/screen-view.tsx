import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { Child, ScreenViewSession } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Monitor,
  RefreshCw,
  Clock,
  Camera,
  Calendar
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ScreenViewPage = () => {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(true);

  // Fetch children data
  const { data: childrenData, isLoading: childrenLoading } = useQuery({
    queryKey: ["/api/children"],
    onSuccess: (data) => {
      if (data && data.length > 0 && !selectedChild) {
        setSelectedChild(data[0]);
      }
    },
  });

  // Fetch screen sessions for the selected child
  const { data: screenSessionsData, isLoading: sessionsLoading, refetch } = useQuery({
    queryKey: ["/api/screen-sessions", selectedChild?.id],
    enabled: !!selectedChild,
  });

  const handleRefreshScreenshot = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Screenshot updated",
        description: "The screen view has been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Failed to update screenshot",
        description: "There was a problem refreshing the screen view.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Format time from timestamp
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date from timestamp
  const formatDate = (timestamp: Date) => {
    return timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <MainLayout title="Screen View">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Child's Screen View</h2>
          <div className="flex space-x-2">
            <Button
              onClick={handleRefreshScreenshot}
              disabled={isRefreshing}
              className="inline-flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="live" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="live" onClick={() => setIsLiveMode(true)}>
              <Camera className="mr-2 h-4 w-4" />
              Live View
            </TabsTrigger>
            <TabsTrigger value="history" onClick={() => setIsLiveMode(false)}>
              <Clock className="mr-2 h-4 w-4" />
              View History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live">
            <Card>
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Monitor className="mr-2 h-5 w-5" />
                    Live Screen View
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1 h-4 w-4" />
                    Last update: {new Date().toLocaleTimeString()}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gray-100 rounded-lg overflow-hidden shadow-inner h-[600px] flex items-center justify-center">
                  <div className="text-center px-6">
                    <Monitor className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      This is where the live screen view would be displayed.
                    </p>
                    <p className="text-sm text-gray-500">
                      The companion app needs to be installed on the child's device to enable this feature.
                    </p>
                    <Button 
                      onClick={handleRefreshScreenshot} 
                      disabled={isRefreshing}
                      className="mt-4"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      {isRefreshing ? "Requesting..." : "Request Screenshot"}
                    </Button>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-800">
                  <p className="font-medium mb-1">Current App: YouTube Kids</p>
                  <p>Device: Emma's iPad</p>
                  <p>Session Duration: 45 minutes</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Screenshot History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div key={index} className="bg-white rounded-lg overflow-hidden shadow border border-gray-200">
                      <div className="bg-gray-100 h-40 flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">
                            {index % 2 === 0 ? "YouTube Kids" : "Math Game"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(new Date(Date.now() - index * 30 * 60000))}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(new Date(Date.now() - index * 30 * 60000))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ScreenViewPage;
