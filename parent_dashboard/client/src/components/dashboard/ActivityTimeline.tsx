import React from "react";
import { ActivityItem } from "@/types";
import { Monitor, Ban, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const getIconForActivity = (type: string) => {
    switch (type) {
      case "app_usage":
        return (
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ring-8 ring-white">
            <Monitor className="h-6 w-6 text-gray-600" />
          </div>
        );
      case "blocked_content":
        return (
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center ring-8 ring-white">
            <Ban className="h-6 w-6 text-red-600" />
          </div>
        );
      case "location_update":
        return (
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-white">
            <MapPin className="h-6 w-6 text-green-600" />
          </div>
        );
      case "device_status":
        return (
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ring-8 ring-white">
            <Monitor className="h-6 w-6 text-gray-600" />
          </div>
        );
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <CardTitle className="text-lg leading-6 font-medium text-gray-900">
            Activity Timeline
          </CardTitle>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Last 24 hours of activity
          </p>
        </div>
        <Button
          onClick={() => {
            // Refresh activities
          }}
        >
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, index) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {index < activities.length - 1 && (
                    <span
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    ></span>
                  )}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      {getIconForActivity(activity.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <a href="#" className="font-medium text-gray-900">
                            {activity.title}
                          </a>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {activity.time}
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>{activity.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline">View full activity log</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
