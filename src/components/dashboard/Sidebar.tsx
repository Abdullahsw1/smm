import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  ShoppingCart,
  BarChart2,
  Wallet,
  Settings,
  LogOut,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  className?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  activeItem?: string;
}

const Sidebar = ({
  className,
  userName = "John Doe",
  userEmail = "john@example.com",
  userAvatar = "",
  activeItem = "dashboard",
}: SidebarProps) => {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home size={20} />,
      path: "/dashboard",
    },
    {
      id: "services",
      label: "Services",
      icon: <ShoppingCart size={20} />,
      path: "/services",
    },
    {
      id: "orders",
      label: "My Orders",
      icon: <BarChart2 size={20} />,
      path: "/orders",
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: <Wallet size={20} />,
      path: "/wallet",
    },
    {
      id: "account",
      label: "Account",
      icon: <Settings size={20} />,
      path: "/account",
    },
  ];

  const serviceCategories = [
    {
      id: "instagram",
      label: "Instagram",
      icon: <Instagram size={18} />,
      path: "/services?platform=instagram",
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: <Facebook size={18} />,
      path: "/services?platform=facebook",
    },
    {
      id: "twitter",
      label: "Twitter",
      icon: <Twitter size={18} />,
      path: "/services?platform=twitter",
    },
    {
      id: "youtube",
      label: "YouTube",
      icon: <Youtube size={18} />,
      path: "/services?platform=youtube",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full w-64 bg-white border-r border-gray-200 shadow-sm",
        className,
      )}
    >
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={
                userAvatar ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
              }
              alt={userName}
            />
            <AvatarFallback>
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{userName}</span>
            <span className="text-xs text-gray-500">{userEmail}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md group transition-colors",
                activeItem === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Service Categories */}
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Service Categories
          </h3>
          <div className="mt-2 space-y-1">
            {serviceCategories.map((category) => (
              <Link
                key={category.id}
                to={category.path}
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 group transition-colors"
              >
                <span className="mr-3 text-gray-500 group-hover:text-gray-700">
                  {category.icon}
                </span>
                <span>{category.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Link
            to="/help"
            className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <HelpCircle size={18} className="mr-3 text-gray-500" />
            <span>Help & Support</span>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} className="mr-3" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
