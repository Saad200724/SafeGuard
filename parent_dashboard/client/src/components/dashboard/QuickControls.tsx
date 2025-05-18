import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { QuickControlsState } from "@/types";
import { Lock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickControlsProps {
  childId: number;
  initialControls: QuickControlsState;
  onUpdateControls: (controls: QuickControlsState) => Promise<void>;
}

const QuickControls: React.FC<QuickControlsProps> = ({
  childId,
  initialControls,
  onUpdateControls,
}) => {
  const [controls, setControls] = useState<QuickControlsState>(initialControls);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleControlChange = (key: keyof QuickControlsState) => {
    setControls((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveChanges = async () => {
    try {
      setIsUpdating(true);
      await onUpdateControls(controls);
      toast({
        title: "Controls updated",
        description: "The device controls have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to update controls",
        description: "There was a problem updating the device controls.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLockDevice = () => {
    toast({
      title: "Device locked",
      description: "The device has been locked successfully.",
    });
  };

  const handleLocationUpdate = () => {
    toast({
      title: "Location requested",
      description: "A location update has been requested.",
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader className="border-b border-gray-200 px-4 py-5 sm:px-6">
        <CardTitle className="text-lg leading-6 font-medium text-gray-900">
          Device Controls
        </CardTitle>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Apply temporary restrictions or permissions
        </p>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Internet Access Control */}
          <div className="flex items-center space-x-4">
            <Switch
              id="internet_access"
              checked={controls.internetAccess}
              onCheckedChange={() => handleControlChange("internetAccess")}
            />
            <div className="space-y-1">
              <Label
                htmlFor="internet_access"
                className="font-medium text-gray-700"
              >
                Internet Access
              </Label>
              <p className="text-gray-500 text-sm">Allow access to internet</p>
            </div>
          </div>

          {/* App Installation Control */}
          <div className="flex items-center space-x-4">
            <Switch
              id="app_installation"
              checked={controls.appInstallation}
              onCheckedChange={() => handleControlChange("appInstallation")}
            />
            <div className="space-y-1">
              <Label
                htmlFor="app_installation"
                className="font-medium text-gray-700"
              >
                App Installation
              </Label>
              <p className="text-gray-500 text-sm">
                Allow new app installation
              </p>
            </div>
          </div>

          {/* Screen Time Extension */}
          <div className="flex items-center space-x-4">
            <Switch
              id="screentime_extension"
              checked={controls.screenTimeBonus}
              onCheckedChange={() => handleControlChange("screenTimeBonus")}
            />
            <div className="space-y-1">
              <Label
                htmlFor="screentime_extension"
                className="font-medium text-gray-700"
              >
                Screen Time Bonus
              </Label>
              <p className="text-gray-500 text-sm">Allow 30 min extra today</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={saveChanges} 
            disabled={isUpdating}
            className="ml-3"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Immediate Lockdown */}
            <Button
              variant="destructive"
              onClick={handleLockDevice}
              className="inline-flex items-center justify-center"
            >
              <Lock className="-ml-1 mr-2 h-5 w-5" />
              Lock Device Now
            </Button>

            {/* Location Request */}
            <Button
              onClick={handleLocationUpdate}
              className="inline-flex items-center justify-center"
            >
              <MapPin className="-ml-1 mr-2 h-5 w-5" />
              Request Location Update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickControls;
