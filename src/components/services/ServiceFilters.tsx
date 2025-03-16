import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ServiceFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  platform: string;
  serviceType: string;
  priceRange: string;
  deliveryTime: string;
  search: string;
}

const ServiceFilters = ({ onFilterChange = () => {} }: ServiceFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    platform: "",
    serviceType: "",
    priceRange: "",
    deliveryTime: "",
    search: "",
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange("search", e.target.value);
  };

  const handleReset = () => {
    const resetFilters = {
      platform: "",
      serviceType: "",
      priceRange: "",
      deliveryTime: "",
      search: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search services..."
            className="pl-9"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2">
          <Select
            value={filters.platform}
            onValueChange={(value) => handleFilterChange("platform", value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.serviceType}
            onValueChange={(value) => handleFilterChange("serviceType", value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Service Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="likes">Likes</SelectItem>
              <SelectItem value="views">Views</SelectItem>
              <SelectItem value="comments">Comments</SelectItem>
              <SelectItem value="shares">Shares</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange("priceRange", value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-10">$0 - $10</SelectItem>
              <SelectItem value="10-25">$10 - $25</SelectItem>
              <SelectItem value="25-50">$25 - $50</SelectItem>
              <SelectItem value="50-100">$50 - $100</SelectItem>
              <SelectItem value="100+">$100+</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.deliveryTime}
            onValueChange={(value) => handleFilterChange("deliveryTime", value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Delivery Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Within 1 hour</SelectItem>
              <SelectItem value="6h">Within 6 hours</SelectItem>
              <SelectItem value="12h">Within 12 hours</SelectItem>
              <SelectItem value="24h">Within 24 hours</SelectItem>
              <SelectItem value="48h">Within 48 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="md:self-end"
        >
          <Filter className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ServiceFilters;
