import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Switch } from "../ui/switch";
import { Bell, Mail, MessageSquare, AlertTriangle } from "lucide-react";

interface NotificationSettingProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

const NotificationSetting = ({
  icon,
  title,
  description,
  defaultChecked = false,
  onChange = () => {},
}: NotificationSettingProps) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-muted p-2 text-muted-foreground">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch defaultChecked={defaultChecked} onCheckedChange={onChange} />
    </div>
  );
};

interface NotificationSettingsProps {
  emailSettings?: {
    marketing?: boolean;
    accountUpdates?: boolean;
    securityAlerts?: boolean;
  };
  appSettings?: {
    newOrders?: boolean;
    orderUpdates?: boolean;
    promotions?: boolean;
  };
  onEmailSettingChange?: (setting: string, value: boolean) => void;
  onAppSettingChange?: (setting: string, value: boolean) => void;
}

const NotificationSettings = ({
  emailSettings = {
    marketing: true,
    accountUpdates: true,
    securityAlerts: true,
  },
  appSettings = {
    newOrders: true,
    orderUpdates: true,
    promotions: false,
  },
  onEmailSettingChange = () => {},
  onAppSettingChange = () => {},
}: NotificationSettingsProps) => {
  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure how and when you want to be notified about activity on your
          account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
          <div className="space-y-1 divide-y">
            <NotificationSetting
              icon={<Mail size={18} />}
              title="Marketing Emails"
              description="Receive emails about new services, promotions, and platform updates."
              defaultChecked={emailSettings.marketing}
              onChange={(checked) => onEmailSettingChange("marketing", checked)}
            />
            <NotificationSetting
              icon={<Bell size={18} />}
              title="Account Updates"
              description="Receive emails about your account activity and changes."
              defaultChecked={emailSettings.accountUpdates}
              onChange={(checked) =>
                onEmailSettingChange("accountUpdates", checked)
              }
            />
            <NotificationSetting
              icon={<AlertTriangle size={18} />}
              title="Security Alerts"
              description="Get notified about security alerts and suspicious activities."
              defaultChecked={emailSettings.securityAlerts}
              onChange={(checked) =>
                onEmailSettingChange("securityAlerts", checked)
              }
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">In-App Notifications</h3>
          <div className="space-y-1 divide-y">
            <NotificationSetting
              icon={<Bell size={18} />}
              title="New Orders"
              description="Get notified when you place a new order."
              defaultChecked={appSettings.newOrders}
              onChange={(checked) => onAppSettingChange("newOrders", checked)}
            />
            <NotificationSetting
              icon={<MessageSquare size={18} />}
              title="Order Updates"
              description="Receive notifications when your order status changes."
              defaultChecked={appSettings.orderUpdates}
              onChange={(checked) =>
                onAppSettingChange("orderUpdates", checked)
              }
            />
            <NotificationSetting
              icon={<Mail size={18} />}
              title="Promotions & Offers"
              description="Get notified about special offers, discounts, and limited-time promotions."
              defaultChecked={appSettings.promotions}
              onChange={(checked) => onAppSettingChange("promotions", checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
