import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight, Shield, Menu } from "lucide-react";

const AboutPage = () => {
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

      {/* About Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 md:mb-6 text-center">About SafeGuard</h1>
          
          <div className="prose prose-sm sm:prose md:prose-lg lg:prose-xl prose-blue mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4">Our Mission</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              At SafeGuard, our mission is to create a safer digital environment for children. We believe that technology should enrich children's lives without exposing them to inappropriate content or excessive screen time. Our comprehensive parental control solution empowers parents to guide their children's digital journey responsibly.
            </p>
            
            <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4">Our Story</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-4">
              SafeGuard was founded in 2025 by Saad Bin Tofayel Tahsin and Safwan Baari. Concerned about children's digital safety and well-being, they combined their expertise to create a solution that balances protection with privacy and respect for children's autonomy.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              What began as a passion project quickly evolved into a comprehensive platform that helps families navigate the digital world safely.
            </p>
            
            <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4">Our Values</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li className="text-sm sm:text-base md:text-lg text-gray-700"><strong>Safety First:</strong> We prioritize children's digital safety above all else.</li>
              <li className="text-sm sm:text-base md:text-lg text-gray-700"><strong>Privacy:</strong> We respect user privacy and maintain strict data protection standards.</li>
              <li className="text-sm sm:text-base md:text-lg text-gray-700"><strong>Accessibility:</strong> We provide our service for free for the sake of Allah.</li>
              <li className="text-sm sm:text-base md:text-lg text-gray-700"><strong>Empowerment:</strong> We empower parents with tools and knowledge to make informed decisions.</li>
              <li className="text-sm sm:text-base md:text-lg text-gray-700"><strong>Innovation:</strong> We continuously improve our solutions to address evolving digital challenges.</li>
            </ul>
            
            <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4">Our Approach</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              SafeGuard takes a holistic approach to digital safety. Rather than simply blocking content, we provide parents with insights into their children's digital activities and tools to set healthy boundaries. Our platform is designed to grow with your family, adapting to children's changing needs as they mature.
            </p>
            
            <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4">Our Team</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              Our diverse team brings together expertise in cybersecurity, child psychology, user experience design, and software development. This interdisciplinary approach ensures that SafeGuard addresses the technical, emotional, and developmental aspects of children's digital safety.
            </p>
            
            <div className="my-8 text-center">
              <Button 
                onClick={() => setLocation("/login")} 
                className="px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-md text-white bg-primary hover:bg-blue-700"
              >
                Start Protecting Your Children Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
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

export default AboutPage;
