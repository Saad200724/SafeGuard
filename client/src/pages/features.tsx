import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight, Shield, Eye, MapPin, Clock, Lock, Bell, BarChart2, Users, Server, Menu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FeaturesPage = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary" />
              <span 
                className="ml-2 text-2xl font-bold text-gray-900 cursor-pointer" 
                onClick={() => setLocation("/")}
              >
                SafeGuard
              </span>
            </div>
            
            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-1">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[270px] sm:w-[300px]">
                  <div className="flex flex-col space-y-5 mt-8">
                    <button 
                      onClick={() => setLocation("/about")} 
                      className="text-left py-2 text-base font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      About
                    </button>
                    <button 
                      onClick={() => setLocation("/features")} 
                      className="text-left py-2 text-base font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      Features
                    </button>
                    <button 
                      onClick={() => setLocation("/pricing")} 
                      className="text-left py-2 text-base font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      Pricing
                    </button>
                    <button 
                      onClick={() => setLocation("/contact")} 
                      className="text-left py-2 text-base font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      Contact
                    </button>
                    <Button 
                      onClick={() => setLocation("/login")} 
                      className="w-full mt-2"
                    >
                      Parent Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <button 
                onClick={() => setLocation("/about")} 
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => setLocation("/features")} 
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => setLocation("/pricing")} 
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => setLocation("/contact")} 
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Contact
              </button>
              <Button 
                onClick={() => setLocation("/login")} 
                className="flex items-center ml-4"
              >
                Parent Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Complete Parental Control Features</h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-500">
            SafeGuard offers comprehensive tools to monitor and manage your children's digital activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Screen Monitoring</h3>
              <p className="text-gray-600 mb-4">
                View screenshots of your child's device activity in real-time or history. Monitor what content they're accessing and when.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Periodic screenshots
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Activity timeline
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Privacy controls
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Website Blocking</h3>
              <p className="text-gray-600 mb-4">
                Block inappropriate websites and content, creating a safer browsing environment for your children.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Content filtering by category
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Custom blocklist/allowlist
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Block attempt notifications
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Location Tracking</h3>
              <p className="text-gray-600 mb-4">
                Know where your children are at all times with real-time location tracking and history.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Real-time location updates
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Location history
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Geofencing alerts
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">App Usage Limits</h3>
              <p className="text-gray-600 mb-4">
                Set time limits for apps and games to encourage balanced digital habits and prevent overuse.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Daily time limits per app
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Schedule-based restrictions
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Reward extension options
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Alerts & Notifications</h3>
              <p className="text-gray-600 mb-4">
                Receive instant alerts about concerning activities or when rules are broken.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Customizable alert triggers
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Real-time notifications
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Weekly activity reports
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Activity Analytics</h3>
              <p className="text-gray-600 mb-4">
                Gain insights into your child's digital habits with detailed analytics and reports.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Usage trends and patterns
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  App category breakdown
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Exportable reports
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <Button 
            onClick={() => setLocation("/login")} 
            className="px-8 py-3 text-base font-medium rounded-md text-white bg-primary hover:bg-blue-700"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="mt-4 text-gray-500">No credit card required for basic plan</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold">SafeGuard</span>
            </div>
            <div className="flex space-x-6">
              <button onClick={() => setLocation("/about")} className="text-gray-300 hover:text-white">About</button>
              <button onClick={() => setLocation("/features")} className="text-gray-300 hover:text-white">Features</button>
              <button onClick={() => setLocation("/pricing")} className="text-gray-300 hover:text-white">Pricing</button>
              <button onClick={() => setLocation("/contact")} className="text-gray-300 hover:text-white">Contact</button>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2025 SafeGuard. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400">Protecting children in the digital age</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;
