import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Users, ThumbsUp, Eye, Star, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface Service {
  id: string;
  name: string;
  description: string;
  platform: "Instagram" | "Facebook" | "Twitter" | "YouTube" | "TikTok";
  type: "Followers" | "Likes" | "Views" | "Comments" | "Shares";
  price: number;
  minQuantity: number;
  maxQuantity: number;
  deliveryTime: string;
  quality: "Standard" | "Premium" | "High Quality";
  rating: number;
}

interface ServiceListProps {
  services?: Service[];
  view?: "grid" | "list";
}

const ServiceList = ({
  services = [
    {
      id: "1",
      name: "Instagram Followers",
      description: "Real and active Instagram followers to boost your profile.",
      platform: "Instagram",
      type: "Followers",
      price: 2.99,
      minQuantity: 100,
      maxQuantity: 10000,
      deliveryTime: "1-2 days",
      quality: "Standard",
      rating: 4.5,
    },
    {
      id: "2",
      name: "Facebook Page Likes",
      description: "Increase your Facebook page popularity with real likes.",
      platform: "Facebook",
      type: "Likes",
      price: 3.49,
      minQuantity: 100,
      maxQuantity: 5000,
      deliveryTime: "2-3 days",
      quality: "Premium",
      rating: 4.2,
    },
    {
      id: "3",
      name: "YouTube Views",
      description:
        "Get more views on your YouTube videos to increase visibility.",
      platform: "YouTube",
      type: "Views",
      price: 1.99,
      minQuantity: 500,
      maxQuantity: 50000,
      deliveryTime: "1-3 days",
      quality: "High Quality",
      rating: 4.7,
    },
    {
      id: "4",
      name: "Twitter Followers",
      description: "Grow your Twitter audience with active followers.",
      platform: "Twitter",
      type: "Followers",
      price: 2.49,
      minQuantity: 100,
      maxQuantity: 5000,
      deliveryTime: "1-2 days",
      quality: "Standard",
      rating: 4.0,
    },
    {
      id: "5",
      name: "TikTok Likes",
      description: "Boost your TikTok content with genuine likes.",
      platform: "TikTok",
      type: "Likes",
      price: 1.79,
      minQuantity: 100,
      maxQuantity: 10000,
      deliveryTime: "1 day",
      quality: "Premium",
      rating: 4.8,
    },
    {
      id: "6",
      name: "Instagram Comments",
      description: "Custom comments for your Instagram posts.",
      platform: "Instagram",
      type: "Comments",
      price: 4.99,
      minQuantity: 10,
      maxQuantity: 500,
      deliveryTime: "2-3 days",
      quality: "High Quality",
      rating: 4.6,
    },
  ],
  view = "grid",
}: ServiceListProps) => {
  const [currentView, setCurrentView] = useState<"grid" | "list">(view);

  const getServiceIcon = (type: Service["type"]) => {
    switch (type) {
      case "Followers":
        return <Users className="h-5 w-5 text-blue-500" />;
      case "Likes":
        return <ThumbsUp className="h-5 w-5 text-red-500" />;
      case "Views":
        return <Eye className="h-5 w-5 text-green-500" />;
      case "Comments":
        return <ExternalLink className="h-5 w-5 text-purple-500" />;
      case "Shares":
        return <ExternalLink className="h-5 w-5 text-orange-500" />;
      default:
        return <Star className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getPlatformColor = (platform: Service["platform"]) => {
    switch (platform) {
      case "Instagram":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "Facebook":
        return "bg-blue-600";
      case "Twitter":
        return "bg-sky-500";
      case "YouTube":
        return "bg-red-600";
      case "TikTok":
        return "bg-black";
      default:
        return "bg-gray-500";
    }
  };

  const getQualityBadgeColor = (quality: Service["quality"]) => {
    switch (quality) {
      case "Standard":
        return "bg-gray-100 text-gray-800";
      case "Premium":
        return "bg-blue-100 text-blue-800";
      case "High Quality":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Available Services ({services.length})
        </h2>
        <div className="flex space-x-2">
          <Button
            variant={currentView === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentView("grid")}
          >
            Grid View
          </Button>
          <Button
            variant={currentView === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentView("list")}
          >
            List View
          </Button>
        </div>
      </div>

      {currentView === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <div className={cn("h-2", getPlatformColor(service.platform))} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getServiceIcon(service.type)}
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        getQualityBadgeColor(service.quality),
                      )}
                    >
                      {service.quality}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {service.rating}
                    </span>
                  </div>
                </div>
                <CardTitle className="mt-2">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Price</span>
                    <span className="font-medium text-green-600">
                      ${service.price.toFixed(2)} per 1000
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Quantity</span>
                    <span className="font-medium">
                      {service.minQuantity} - {service.maxQuantity}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Platform</span>
                    <span className="font-medium">{service.platform}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Delivery</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="font-medium">
                        {service.deliveryTime}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/services/order?service=${service.id}`}>
                    Order Now
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div
                  className={cn(
                    "w-1 md:w-2",
                    getPlatformColor(service.platform),
                  )}
                />
                <div className="flex-1 p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-xs font-medium",
                          getQualityBadgeColor(service.quality),
                        )}
                      >
                        {service.quality}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {service.rating}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{service.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-gray-600">
                    {service.description}
                  </p>
                  <div className="mb-4 flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      {getServiceIcon(service.type)}
                      <span className="text-sm">{service.type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm">
                        <span className="font-medium">{service.platform}</span>
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm">
                        <span className="font-medium text-green-600">
                          ${service.price.toFixed(2)}
                        </span>{" "}
                        per 1000
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm">
                        <span className="font-medium">
                          {service.minQuantity} - {service.maxQuantity}
                        </span>{" "}
                        quantity
                      </span>
                    </div>
                  </div>
                  <Button asChild>
                    <Link to={`/services/order?service=${service.id}`}>
                      Order Now
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceList;
