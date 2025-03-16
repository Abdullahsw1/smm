import React from "react";
import { Card, CardContent } from "../ui/card";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

interface ServiceCategoryProps {
  categories?: {
    name: string;
    icon: React.ReactNode;
    description: string;
  }[];
}

const ServiceCategories = ({ categories }: ServiceCategoryProps) => {
  const defaultCategories = [
    {
      name: "Instagram",
      icon: <Instagram className="h-10 w-10 text-pink-500" />,
      description: "Boost your profile with followers, likes, and views",
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-10 w-10 text-blue-600" />,
      description: "Grow your page with likes, followers, and engagement",
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-10 w-10 text-sky-400" />,
      description: "Increase your reach with followers, retweets, and likes",
    },
    {
      name: "YouTube",
      icon: <Youtube className="h-10 w-10 text-red-600" />,
      description: "Expand your channel with views, subscribers, and comments",
    },
  ];

  const displayCategories = categories || defaultCategories;

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Our Services
        </h2>
        <p className="mt-4 text-xl text-gray-500">
          Boost your social media presence with our premium marketing services
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {displayCategories.map((category, index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                {category.icon}
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-gray-500">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceCategories;
