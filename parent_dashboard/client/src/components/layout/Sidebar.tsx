import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  MapPin,
  Clock,
  Ban,
  Monitor,
  Mic,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="mr-3 h-6 w-6" /> },
    {
      name: "Location Tracking",
      path: "/location",
      icon: <MapPin className="mr-3 h-6 w-6" />,
    },
    {
      name: "Browsing History",
      path: "/browsing-history",
      icon: <Clock className="mr-3 h-6 w-6" />,
    },
    {
      name: "Site Blocker",
      path: "/site-blocker",
      icon: <Ban className="mr-3 h-6 w-6" />,
    },
    {
      name: "Screen View",
      path: "/screen-view",
      icon: <Monitor className="mr-3 h-6 w-6" />,
    },
    {
      name: "Audio Listener",
      path: "/audio-listener",
      icon: <Mic className="mr-3 h-6 w-6" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="mr-3 h-6 w-6" />,
    },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 px-4 bg-primary cursor-pointer" onClick={() => window.location.href = '/'}>
          <h1 className="text-xl font-bold text-white">SafeGuard</h1>
        </div>
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    location === item.path
                      ? "bg-blue-100 text-primary"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* User profile */}
          {user && (
            <div className="flex items-center px-4 py-3 border-t border-gray-200">
              <Avatar className="flex-shrink-0">
                <AvatarImage
                  src={user.user_metadata?.avatar_url || ""}
                  alt={user.user_metadata?.first_name 
                    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim() 
                    : (user.user_metadata?.full_name || user.email || "User")}
                />
                <AvatarFallback>
                  {((user.user_metadata?.first_name as string)?.charAt(0) || 
                    (user.user_metadata?.full_name as string)?.charAt(0) || 
                    user.email?.charAt(0) || 
                    "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user.user_metadata?.first_name 
                    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim() 
                    : (user.user_metadata?.full_name || user.email?.split("@")[0] || "User")}
                </p>
                <p className="text-xs font-medium text-gray-500">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
