import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Layout } from "@/components/layout/Layout";
import ServiceFilters from "@/components/services/ServiceFilters";
import ServiceList from "@/components/services/ServiceList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FilterState {
  platform: string;
  serviceType: string;
  priceRange: string;
  deliveryTime: string;
  search: string;
}

const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState<FilterState>({
    platform: "",
    serviceType: "",
    priceRange: "",
    deliveryTime: "",
    search: "",
  });

  // Mock categories for the tabs
  const categories = [
    { id: "all", name: "All Services" },
    { id: "instagram", name: "Instagram" },
    { id: "facebook", name: "Facebook" },
    { id: "twitter", name: "Twitter" },
    { id: "youtube", name: "YouTube" },
    { id: "tiktok", name: "TikTok" },
  ];

  // Mock featured services
  const featuredServices = [
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
      quality: "Premium",
      rating: 4.8,
    },
    {
      id: "2",
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
  ];

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // If platform filter is set, switch to that tab
    if (newFilters.platform && newFilters.platform !== filters.platform) {
      setActiveTab(newFilters.platform);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update platform filter when tab changes
    if (value !== "all") {
      setFilters((prev) => ({ ...prev, platform: value }));
    } else {
      setFilters((prev) => ({ ...prev, platform: "" }));
    }
  };

  return (
    <>
      <Helmet>
        <title>Services | SMM Panel</title>
        <meta
          name="description"
          content="Browse and order social media marketing services"
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Services Catalog
            </h1>
            <p className="text-gray-600">
              Browse our comprehensive range of social media marketing services
              to boost your online presence.
            </p>
          </div>

          {/* Featured Services */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-blue-900">
                  Featured Services
                </h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-5 w-5 text-blue-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">
                        Our most popular and effective services
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredServices.map((service) => (
                  <Card
                    key={service.id}
                    className="overflow-hidden border-blue-200 hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{service.name}</h3>
                        <span className="text-sm font-bold text-green-600">
                          ${service.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {service.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {service.platform} • {service.type}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          asChild
                        >
                          <a href={`/services/order?service=${service.id}`}>
                            Order Now
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Filters */}
          <div className="mb-6">
            <ServiceFilters onFilterChange={handleFilterChange} />
          </div>

          {/* Service Categories Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="mb-6"
          >
            <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex md:flex-wrap gap-1">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="px-4 py-2"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                How Our Services Work
              </h3>
              <p className="text-sm text-blue-800">
                Simply select a service, enter your social media link, choose
                the quantity, and place your order. Our system will
                automatically process your request and deliver results within
                the specified timeframe.
              </p>
            </div>
          </div>

          {/* Service List */}
          <ServiceList />
        </div>
      </div>
    </>
  );
};

export default ServicesPage;
