import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/FirebaseAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, LogOut, Bell, Shield, Home, Lock, Mail, HelpCircle } from "lucide-react";
import { auth } from "@/firebase";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, updateProfile } from "firebase/auth";

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  // Load user metadata when component mounts
  useEffect(() => {
    if (user) {
      // Firebase user object doesn't have the same structure as Supabase
      // Extract from displayName if available
      const displayName = user.displayName || '';
      const nameParts = displayName.split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
    }
  }, [user]);
  
  // Handle password change
  const handleChangePassword = async () => {
    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "The new password and confirmation password do not match.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsChangingPassword(true);
      
      if (!user || !user.email) {
        throw new Error("User not authenticated");
      }
      
      // Verify current password by reauthenticating the user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      
      // Update to new password
      await updatePassword(user, newPassword);
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated."
      });
      
      // Reset fields and close dialog
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordDialogOpen(false);
      
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        title: "Password Change Failed",
        description: error.message || "An error occurred while updating your password.",
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      setIsUpdatingProfile(true);
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Update the user's profile in Firebase
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`.trim()
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully."
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setLocation("/"); // Redirect to landing page
      toast({
        title: "Logged out successfully",
        description: "You have been logged out from your account.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout title="Settings">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar navigation */}
        <div className="col-span-1 space-y-4">
          <nav className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Settings</h3>
              <p className="mt-1 text-sm text-gray-500">Manage your account and preferences</p>
            </div>
            <div className="divide-y divide-gray-200">
              <Button variant="ghost" className="w-full justify-start py-3 px-4 rounded-none">
                <User className="mr-3 h-5 w-5 text-gray-400" />
                <span>Account</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start py-3 px-4 rounded-none">
                <Bell className="mr-3 h-5 w-5 text-gray-400" />
                <span>Notifications</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start py-3 px-4 rounded-none">
                <Shield className="mr-3 h-5 w-5 text-gray-400" />
                <span>Security</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start py-3 px-4 bg-gray-50 rounded-none"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5 text-red-500" />
                <span className="text-red-500">Logout</span>
              </Button>
            </div>
          </nav>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Access frequently used pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="link" onClick={() => setLocation("/")} className="p-0 h-auto">
                  <Home className="mr-2 h-4 w-4" /> Home Page
                </Button>
                <Button variant="link" onClick={() => setLocation("/dashboard")} className="p-0 h-auto">
                  <User className="mr-2 h-4 w-4" /> Dashboard
                </Button>
                <Button variant="link" onClick={() => setLocation("/contact")} className="p-0 h-auto">
                  <HelpCircle className="mr-2 h-4 w-4" /> Help & Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john.doe@example.com" 
                  value={user?.email || ''} 
                  disabled 
                />
                <p className="text-xs text-gray-500">Email cannot be changed. Contact support for help.</p>
              </div>
              <Button 
                onClick={handleUpdateProfile} 
                type="button" 
                disabled={isUpdatingProfile}
                className="mt-2"
              >
                {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications-email">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive emails about your child's activity</p>
                </div>
                <Switch id="notifications-email" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications-push">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive alerts on your mobile device</p>
                </div>
                <Switch id="notifications-push" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification-frequency">Alert Frequency</Label>
                <Select defaultValue="immediate">
                  <SelectTrigger id="notification-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and choose a new secure password.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => {
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}>
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Additional security for your account</p>
                </div>
                <Switch id="two-factor" />
              </div>
            </CardContent>
          </Card>

          {/* Logout Section */}
          <Card className="border-red-100">
            <CardHeader>
              <CardTitle className="text-red-600">Logout</CardTitle>
              <CardDescription>Sign out from your account</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                When you log out, you'll need to sign in again with your credentials to access the dashboard.
              </p>
              <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
                <LogOut className="mr-2 h-4 w-4" />
                Logout from SafeGuard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;