import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight, Shield, Eye, MapPin, Clock, Lock, Menu } from "lucide-react";

const LandingPage = () => {
  // wouter uses useLocation hook instead of useNavigate
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold text-gray-900">SafeGuard</span>
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

      {/* Hero section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Protect Your Children</span>
                <span className="block text-primary">in the Digital World</span>
              </h1>
              <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
                SafeGuard provides powerful parental controls to monitor and manage your children's digital activities. Keep them safe online with real-time monitoring and smart restrictions.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                <Button 
                  onClick={() => setLocation("/login")} 
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-primary hover:bg-blue-700 md:py-4 md:text-lg md:px-10 shadow-md hover:shadow-lg transition-all">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation("/features")}
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-3 text-base font-medium rounded-md border-gray-300 hover:border-gray-400 md:py-4 md:text-lg md:px-10 transition-all">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:w-1/2">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                <div className="px-6 py-8 sm:p-10 bg-blue-50 border-b border-blue-100">
                  <div className="flex items-center justify-center">
                    <Shield className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="mt-4 text-center text-2xl font-medium text-gray-900">Comprehensive Protection</h3>
                  <p className="mt-2 text-center text-gray-600">
                    A complete solution for parents to ensure their children's digital safety
                  </p>
                </div>
                <div className="px-6 py-8 sm:p-10">
                  <ul className="space-y-4">
                    <li className="flex items-start group">
                      <div className="flex-shrink-0 p-1 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors">
                        <Eye className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">Screen time monitoring and management</p>
                    </li>
                    <li className="flex items-start group">
                      <div className="flex-shrink-0 p-1 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors">
                        <Lock className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">Website blocking and content filtering</p>
                    </li>
                    <li className="flex items-start group">
                      <div className="flex-shrink-0 p-1 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors">
                        <MapPin className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">Location tracking and geofencing</p>
                    </li>
                    <li className="flex items-start group">
                      <div className="flex-shrink-0 p-1 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors">
                        <Clock className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">App usage statistics and time limits</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Comprehensive Parental Control Features
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Everything you need to keep your children safe online
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg hover:border-blue-100 transition-all duration-300 h-full flex flex-col">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-5">
                <Eye className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Screen Monitoring</h3>
              <p className="mt-3 text-gray-600 flex-grow">
                View screenshots of your child's device to ensure they're engaging with appropriate content.
              </p>
              <Button 
                variant="link" 
                onClick={() => setLocation("/features")} 
                className="mt-4 p-0 h-auto justify-start text-primary hover:text-primary/80"
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg hover:border-blue-100 transition-all duration-300 h-full flex flex-col">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-5">
                <Lock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Website Blocking</h3>
              <p className="mt-3 text-gray-600 flex-grow">
                Block inappropriate websites and content to create a safer browsing environment.
              </p>
              <Button 
                variant="link" 
                onClick={() => setLocation("/features")} 
                className="mt-4 p-0 h-auto justify-start text-primary hover:text-primary/80"
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg hover:border-blue-100 transition-all duration-300 h-full flex flex-col">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-5">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Location Tracking</h3>
              <p className="mt-3 text-gray-600 flex-grow">
                Know where your children are at all times with real-time location monitoring.
              </p>
              <Button 
                variant="link" 
                onClick={() => setLocation("/features")} 
                className="mt-4 p-0 h-auto justify-start text-primary hover:text-primary/80"
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg hover:border-blue-100 transition-all duration-300 h-full flex flex-col">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-5">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">App Usage Limits</h3>
              <p className="mt-3 text-gray-600 flex-grow">
                Set time limits for apps and games to encourage balanced digital habits.
              </p>
              <Button 
                variant="link" 
                onClick={() => setLocation("/features")} 
                className="mt-4 p-0 h-auto justify-start text-primary hover:text-primary/80"
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* View All Features Button */}
          <div className="mt-12 text-center">
            <Button 
              onClick={() => setLocation("/features")} 
              variant="outline" 
              className="px-6 py-2 border-primary text-primary hover:bg-primary hover:text-white"
            >
              View All Features <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
              Ready to protect your children online?
            </h2>
            <p className="mt-6 text-xl text-blue-100">
              Get started with SafeGuard today and gain peace of mind.
            </p>
            <div className="mt-10">
              <Button 
                onClick={() => setLocation("/login")} 
                className="bg-white text-primary hover:bg-gray-100 border-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold">SafeGuard</span>
              </div>
              <p className="text-gray-400 mt-2">Protecting children in the ever-changing digital landscape with advanced monitoring tools and real-time alerts.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setLocation("/about")} className="text-gray-300 hover:text-white text-left hover:underline transition-colors">About</button>
                <button onClick={() => setLocation("/features")} className="text-gray-300 hover:text-white text-left hover:underline transition-colors">Features</button>
                <button onClick={() => setLocation("/pricing")} className="text-gray-300 hover:text-white text-left hover:underline transition-colors">Pricing</button>
                <button onClick={() => setLocation("/contact")} className="text-gray-300 hover:text-white text-left hover:underline transition-colors">Contact</button>
                <button onClick={() => setLocation("/login")} className="text-gray-300 hover:text-white text-left hover:underline transition-colors">Login</button>
                <button onClick={() => setLocation("/signup")} className="text-gray-300 hover:text-white text-left hover:underline transition-colors">Sign Up</button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <p className="text-gray-400">Have questions or need support? Reach out to our team.</p>
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/contact")} 
                className="text-white border border-blue-500 hover:bg-blue-600 transition-colors"
              >
                Contact Support
              </Button>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} SafeGuard. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
