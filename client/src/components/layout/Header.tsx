import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  MapPin,
  Clock,
  Ban,
  Monitor,
  Mic,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, signOut } = useAuth();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/", icon: <Home className="mr-3 h-6 w-6" /> },
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
    <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center justify-between bg-white border-b border-gray-200">
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <div className="px-4 py-6 bg-primary -mx-5 -my-2 mb-4">
            <h1 className="text-xl font-bold text-white">SafeGuard</h1>
          </div>
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location === item.path
                    ? "bg-blue-100 text-primary"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => {
                signOut();
                setIsMenuOpen(false);
              }}
              className="flex items-center px-2 py-2 mt-8 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-6 w-6" />
              Logout
            </button>
          </nav>

          {user && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center px-2 py-3 border-t border-gray-200">
              <Avatar className="flex-shrink-0">
                <AvatarImage
                  src={user.user_metadata?.avatar_url || ""}
                  alt={`${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email || "User"}
                />
                <AvatarFallback>
                  {((user.user_metadata?.first_name as string)?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {`${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs font-medium text-gray-500">{user.email}</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <div className="px-4">
        <h1 className="text-xl font-bold text-primary">SafeGuard</h1>
      </div>
    </div>
  );
};

export default Header;
