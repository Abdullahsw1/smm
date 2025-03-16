import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "@/components/account/ProfileForm";
import PasswordForm from "@/components/account/PasswordForm";
import NotificationSettings from "@/components/account/NotificationSettings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Lock, Bell } from "lucide-react";

const AccountPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock size={16} />
              <span>Password</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell size={16} />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card className="bg-transparent border-none shadow-none">
              <CardHeader className="px-0">
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and how others see you on the
                  platform
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <ProfileForm
                  initialData={{
                    fullName: "John Doe",
                    email: "john.doe@example.com",
                    username: "johndoe",
                    phone: "+1 (555) 123-4567",
                  }}
                  onSubmit={(data) => console.log("Profile updated:", data)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="space-y-4">
            <Card className="bg-transparent border-none shadow-none">
              <CardHeader className="px-0">
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and account security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <PasswordForm
                  onSubmit={(data) => console.log("Password updated:", data)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="bg-transparent border-none shadow-none">
              <CardHeader className="px-0">
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how and when you receive notifications from the
                  platform
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <NotificationSettings
                  emailSettings={{
                    marketing: true,
                    accountUpdates: true,
                    securityAlerts: true,
                  }}
                  appSettings={{
                    newOrders: true,
                    orderUpdates: true,
                    promotions: false,
                  }}
                  onEmailSettingChange={(setting, value) =>
                    console.log(`Email setting ${setting} changed to ${value}`)
                  }
                  onAppSettingChange={(setting, value) =>
                    console.log(`App setting ${setting} changed to ${value}`)
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountPage;
