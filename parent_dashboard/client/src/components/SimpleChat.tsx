import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

// Define predefined responses
const AI_RESPONSES = {
  default: "I'm your parenting assistant. I can help with questions about child safety, online behavior, and development. How can I help you today?",
  screenTime: "For children 2-5 years, limit screen time to 1 hour per day of high-quality content. For ages 6-12, establish consistent limits that don't replace physical activity and social interaction. For teens, focus on achieving a healthy balance with other activities.",
  onlineSafety: "Start conversations early using age-appropriate language about online risks. Teach children not to share personal information with strangers. Establish clear internet safety rules and encourage them to tell you about uncomfortable situations without fear of punishment.",
  cyberbullying: "Watch for behavioral changes like social withdrawal, anxiety when receiving notifications, or becoming upset after using devices. Look for reluctance to discuss online activities or suddenly switching screens when you approach. Create a safe space for them to share experiences without fear of losing device privileges.",
  monitoring: "Balance monitoring with trust by being transparent about oversight. Explain supervision is for safety, not a lack of trust. Keep devices in common areas of your home. For younger children, use age-appropriate parental controls, gradually reducing restrictions as they demonstrate responsibility.",
  apps: "Be aware of anonymous messaging apps, dating apps, live streaming platforms that connect with strangers, and apps with disappearing content. Rather than banning all apps, discuss potential risks, establish clear guidelines, and stay informed about new apps.",
  smartphone: "Most experts suggest waiting until at least middle school (11-13 years) for a first smartphone. Consider your child's maturity, responsibility with other devices, ability to follow rules, and communication needs. Start with a basic phone before upgrading to a smartphone.",
  digitalHabits: "Model healthy digital habits yourself. Create tech-free zones and times. Balance screen activities with physical play, reading, and face-to-face interactions. Teach mindful technology use by helping them recognize quality content versus mindless scrolling.",
  inappropriateContent: "If you discover inappropriate content, stay calm and avoid immediate accusations. Find a private moment for a conversation using a curious tone. Ask open-ended questions about how they found the content and how it made them feel. Listen without judgment to understand the context."
};

// Function to find the best response based on keywords
function findResponse(query: string): string {
  if (!query || query.trim() === "") {
    return AI_RESPONSES.default;
  }
  
  query = query.toLowerCase();
  
  if (query.includes("screen time") || query.includes("digital") || query.includes("limit") || 
      query.includes("tablet") || query.includes("phone usage")) {
    return AI_RESPONSES.screenTime;
  }
  
  if (query.includes("safety") || query.includes("internet") || query.includes("protect") || 
      query.includes("online danger") || query.includes("stranger")) {
    return AI_RESPONSES.onlineSafety;
  }
  
  if (query.includes("bully") || query.includes("cyberbully") || query.includes("harass") || 
      query.includes("mean") || query.includes("threat")) {
    return AI_RESPONSES.cyberbullying;
  }
  
  if (query.includes("monitor") || query.includes("track") || query.includes("supervise") || 
      query.includes("checking") || query.includes("spy") || query.includes("privacy")) {
    return AI_RESPONSES.monitoring;
  }
  
  if (query.includes("app") || query.includes("tiktok") || query.includes("social media") || 
      query.includes("instagram") || query.includes("snapchat")) {
    return AI_RESPONSES.apps;
  }
  
  if (query.includes("smartphone") || query.includes("phone") || query.includes("mobile") || 
      query.includes("device") || query.includes("first phone")) {
    return AI_RESPONSES.smartphone;
  }
  
  if (query.includes("habit") || query.includes("addiction") || query.includes("balance") || 
      query.includes("routine") || query.includes("too much time")) {
    return AI_RESPONSES.digitalHabits;
  }
  
  if (query.includes("inappropriate") || query.includes("content") || query.includes("adult") || 
      query.includes("explicit") || query.includes("pornography")) {
    return AI_RESPONSES.inappropriateContent;
  }
  
  return "I don't have specific information about that topic. Please try asking about screen time, online safety, cyberbullying, monitoring, apps, smartphones, digital habits, or dealing with inappropriate content.";
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function SimpleChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: AI_RESPONSES.default
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = { 
      role: "user", 
      content: input 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Get AI response
      const response = findResponse(input);
      
      // Add AI response
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: response 
      }]);
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>SafeGuard AI Assistant</CardTitle>
        <CardDescription>
          Ask questions about parenting, child safety, or get insights about your child's online activities.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className={`w-8 h-8 ${message.role === "user" ? "ml-2" : "mr-2"}`}>
                    <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center text-xs">
                      {message.role === "user" ? "You" : "AI"}
                    </div>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Textarea
          placeholder="Ask a question about parenting or online safety..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={isLoading || !input.trim()}
        >
          Send
        </Button>
      </CardFooter>
    </Card>
  );
}