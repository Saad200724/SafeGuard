import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight, Shield, Mail, Phone, MapPin, Send, Menu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactPage = () => {
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

      {/* Contact Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Get in Touch</h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-500">
            Have questions about SafeGuard? Our team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600">saadbintofayeltahsin@gmail.com</p>
                    <p className="text-gray-500 text-sm mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600">+880 1980-245742</p>
                    <p className="text-gray-500 text-sm mt-1">Saturday to Thursday from 3PM to 10PM (GMT+6)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-gray-600">Bank Colony</p>
                    <p className="text-gray-600">Savar</p>
                    <p className="text-gray-600">Dhaka-1340, Bangladesh</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input id="email" type="email" placeholder="your.email@example.com" />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <Input id="subject" placeholder="How can we help you?" />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <Textarea id="message" placeholder="Your message" className="min-h-[150px]" />
                  </div>
                  
                  <Button className="w-full py-6 text-base">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How quickly will I receive a response?</h3>
              <p className="text-gray-600">We aim to respond to all inquiries within 24 hours during business days.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Do you offer technical support?</h3>
              <p className="text-gray-600">Yes, our support team is available to help with any technical issues you may encounter.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Can I request a demo?</h3>
              <p className="text-gray-600">Absolutely! You can request a personalized demo through our contact form.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How do I report a bug?</h3>
              <p className="text-gray-600">Please use our contact form and select "Bug Report" as the subject for fastest resolution.</p>
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

export default ContactPage;
