import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Shield, Grid, MapPin, Clock, Monitor, Mic, 
  User, Bell, LogOut, ChevronDown 
} from "lucide-react";

const Sidebar = () => {
  const { user, signOut } = useAuth();
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path ? "sidebar-item-active" : "hover:bg-slate-50 text-slate-700";
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* Logo and App Name */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white">
              <Shield className="h-5 w-5" />
            </div>
            <h1 className="ml-2 text-xl font-bold text-slate-800">SafeGuard</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Parent Dashboard</p>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            <li>
              <Link href="/dashboard" className={`flex items-center px-3 py-2 text-sm rounded-md w-full ${isActive("/dashboard")}`}>
                <Grid className="h-4 w-4 mr-3" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/location" className={`flex items-center px-3 py-2 text-sm rounded-md w-full ${isActive("/location")}`}>
                <MapPin className="h-4 w-4 mr-3" />
                <span>Location</span>
              </Link>
            </li>
            <li>
              <Link href="/browsing-history" className={`flex items-center px-3 py-2 text-sm rounded-md w-full ${isActive("/browsing-history")}`}>
                <Clock className="h-4 w-4 mr-3" />
                <span>Browsing History</span>
              </Link>
            </li>
            <li>
              <Link href="/site-blocker" className={`flex items-center px-3 py-2 text-sm rounded-md w-full ${isActive("/site-blocker")}`}>
                <Shield className="h-4 w-4 mr-3" />
                <span>Site Blocker</span>
              </Link>
            </li>
            <li>
              <Link href="/screen-view" className={`flex items-center px-3 py-2 text-sm rounded-md w-full ${isActive("/screen-view")}`}>
                <Monitor className="h-4 w-4 mr-3" />
                <span>Screen View</span>
              </Link>
            </li>
            <li>
              <Link href="/audio-listener" className={`flex items-center px-3 py-2 text-sm rounded-md w-full ${isActive("/audio-listener")}`}>
                <Mic className="h-4 w-4 mr-3" />
                <span>Audio Listener</span>
              </Link>
            </li>
          </ul>
          
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Settings
            </h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/account" className={`flex items-center px-3 py-2 text-sm rounded-md w-full ${isActive("/account")} hover:bg-slate-50`}>
                  <User className="h-4 w-4 mr-3" />
                  <span>My Account</span>
                </Link>
              </li>
              <li>
                <Link href="/notifications" className={`flex items-center px-3 py-2 text-sm rounded-md w-full ${isActive("/notifications")} hover:bg-slate-50`}>
                  <Bell className="h-4 w-4 mr-3" />
                  <span>Notifications</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
              <User className="h-4 w-4 text-slate-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-700">{user?.user_metadata?.name || user?.email}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
            <button className="ml-auto text-slate-400 hover:text-slate-500" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
