import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight, Shield, Check, X, Menu } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PricingPage = () => {
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

      {/* Pricing Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Simple, Free Service</h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-500">
            Start protecting your children online with our completely free service, for the sake of Allah.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 border-primary shadow-lg transition-all duration-300">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">Free</CardTitle>
              <p className="text-gray-500">For the sake of Allah</p>
            </CardHeader>
            <CardContent className="text-center pt-4">
              <div className="text-5xl font-bold mb-2">$0</div>
              <p className="text-gray-500 mb-6">Forever free</p>
              <ul className="space-y-3 text-left">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Monitor unlimited child devices</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced website blocking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Screen time management</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Detailed activity reports</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Location tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Real-time alerts</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced analytics</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setLocation("/login")} 
                className="w-full py-6 text-base" 
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Is SafeGuard really completely free?</h3>
              <p className="mt-2 text-gray-600">Yes, SafeGuard is 100% free for all users. We offer this service for the sake of Allah to protect children in the digital world.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Are there any hidden costs?</h3>
              <p className="mt-2 text-gray-600">No, there are absolutely no hidden costs, subscriptions, or premium features. All features are available to everyone without charge.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">How can you provide this service for free?</h3>
              <p className="mt-2 text-gray-600">We are dedicated to the safety of children online and operate this service without profit motive. Our team develops and maintains this platform as a service to the community.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Do you collect and sell user data?</h3>
              <p className="mt-2 text-gray-600">No, we do not sell user data. We only collect information necessary for the service to function, and maintain strict privacy standards to protect all users.</p>
            </div>
          </div>
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

export default PricingPage;
