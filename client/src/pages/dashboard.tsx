import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ChildrenSelector from "@/components/dashboard/ChildrenSelector";
import StatCard from "@/components/dashboard/StatCard";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import QuickControls from "@/components/dashboard/QuickControls";
import { Child, ActivityItem, QuickControlsState } from "@/types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Monitor, BarChart2, Ban, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  // Fetch children data
  const { data: childrenData, isLoading: childrenLoading } = useQuery({
    queryKey: ["/api/children"],
    onSuccess: (data) => {
      if (data && data.length > 0 && !selectedChild) {
        setSelectedChild(data[0]);
      }
    },
  });

  // Fetch activities for selected child
  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities", selectedChild?.id],
    enabled: !!selectedChild,
  });

  // Fetch device settings for selected child
  const { data: deviceSettingsData, isLoading: deviceSettingsLoading } = useQuery({
    queryKey: ["/api/device-settings", selectedChild?.id],
    enabled: !!selectedChild,
  });

  // Update device settings mutation
  const updateDeviceSettingsMutation = useMutation({
    mutationFn: (controls: QuickControlsState) => 
      apiRequest("POST", `/api/device-settings/${selectedChild?.id}`, controls),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/device-settings", selectedChild?.id] });
    },
  });

  const handleUpdateControls = async (controls: QuickControlsState) => {
    if (!selectedChild) return;
    await updateDeviceSettingsMutation.mutateAsync(controls);
  };

  if (childrenLoading) {
    return (
      <MainLayout title="Dashboard">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary"></div>
          <p className="text-gray-500 text-lg animate-pulse">Loading dashboard data...</p>
        </div>
      </MainLayout>
    );
  }

  const children = childrenData || [];
  const activities = activitiesData || [];
  
  const deviceSettings: QuickControlsState = deviceSettingsData || {
    internetAccess: true,
    appInstallation: false,
    screenTimeBonus: false,
  };

  // Format the current time for display
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <MainLayout title="Dashboard">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 whitespace-nowrap">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
            All Devices Online
          </Badge>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Last update: 2 minutes ago
          </span>
        </div>
      </div>

      {/* Children Selection Tabs */}
      <ChildrenSelector
        children={children}
        selectedChild={selectedChild}
        onSelectChild={setSelectedChild}
      />

      {/* Content */}
      <div className="py-4">
        {/* Activity Overview Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Activity Overview
          </h2>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Screen Time Card */}
            <StatCard
              title="Screen Time Today"
              value="3h 45m"
              change={{ value: "45m", type: "increase" }}
              icon={<Monitor className="h-6 w-6" />}
              color="primary"
              linkText="View details"
              linkHref="/screen-view"
            />

            {/* App Usage Card */}
            <StatCard
              title="Top App Usage"
              value="TikTok"
              change={undefined}
              icon={<BarChart2 className="h-6 w-6" />}
              color="secondary"
              linkText="View all apps"
              linkHref="/browsing-history"
            />

            {/* Blocked Sites Card */}
            <StatCard
              title="Blocked Sites (Today)"
              value="12"
              change={{ value: "3", type: "increase" }}
              icon={<Ban className="h-6 w-6" />}
              color="warning"
              linkText="Manage blocked sites"
              linkHref="/site-blocker"
            />

            {/* Location Card */}
            <StatCard
              title="Current Location"
              value="Oak Hill School"
              change={undefined}
              icon={<MapPin className="h-6 w-6" />}
              color="indigo"
              linkText="View map"
              linkHref="/location"
            />
          </div>
        </div>

        {/* Activity Timeline Section */}
        <ActivityTimeline 
          activities={[
            {
              id: 1,
              type: "app_usage",
              title: "App Usage",
              description: "Opened YouTube app for 15 minutes",
              time: "2:30 PM",
              timestamp: new Date(),
            },
            {
              id: 2,
              type: "blocked_content",
              title: "Blocked Content",
              description: "Attempted to access blocked site: social-media-x.com",
              time: "1:45 PM",
              timestamp: new Date(),
            },
            {
              id: 3,
              type: "location_update",
              title: "Location Update",
              description: "Arrived at Oak Hill School",
              time: "12:15 PM",
              timestamp: new Date(),
            },
            {
              id: 4,
              type: "device_status",
              title: "Device Status",
              description: "Device battery at 85%",
              time: "8:30 AM",
              timestamp: new Date(),
            },
          ]}
        />

        {/* Controls Section */}
        <QuickControls
          childId={selectedChild?.id || 0}
          initialControls={deviceSettings}
          onUpdateControls={handleUpdateControls}
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
