import { db } from "./firebase";
import { ref, set } from "firebase/database";
import { Switch, Route } from "wouter";
import { ProtectedRoute } from "@/lib/protected-route";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/FirebaseAuthContext";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import AuthCallbackPage from "@/pages/auth/callback";
import LocationPage from "@/pages/location";
import BrowsingHistoryPage from "@/pages/browsing-history";
import SiteBlockerPage from "@/pages/site-blocker";
import ScreenViewPage from "@/pages/screen-view";
import AudioListenerPage from "@/pages/audio-listener";
import LandingPage from "@/pages/landing";
import AboutPage from "@/pages/about";
import FeaturesPage from "@/pages/features";
import PricingPage from "@/pages/pricing";
import ContactPage from "@/pages/contact";
import SettingsPage from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/location" component={LocationPage} />
      <ProtectedRoute
        path="/browsing-history"
        component={BrowsingHistoryPage}
      />
      <ProtectedRoute path="/site-blocker" component={SiteBlockerPage} />
      <ProtectedRoute path="/screen-view" component={ScreenViewPage} />
      <ProtectedRoute path="/audio-listener" component={AudioListenerPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <Route path="/auth/callback" component={AuthCallbackPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

set(ref(db, "test/path"), {
  example: "hello world",
  timestamp: Date.now(),
});

export default App;
