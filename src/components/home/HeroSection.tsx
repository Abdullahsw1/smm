import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonLink?: string;
  backgroundImage?: string;
}

const HeroSection = ({
  title = "Boost Your Social Media Presence Today",
  subtitle = "Get high-quality followers, likes, and views for Instagram, Facebook, Twitter, and YouTube at competitive prices with fast delivery.",
  primaryButtonText = "Get Started",
  secondaryButtonText = "Browse Services",
  primaryButtonLink = "/auth/register",
  secondaryButtonLink = "/services",
  backgroundImage = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80",
}: HeroSectionProps) => {
  return (
    <div className="relative w-full h-[500px] bg-gray-900 overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: "brightness(0.4)",
        }}
      />

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 max-w-4xl">
          {title}
        </h1>

        <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white font-semibold"
          >
            <Link to={primaryButtonLink}>
              {primaryButtonText} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white/10"
          >
            <Link to={secondaryButtonLink}>{secondaryButtonText}</Link>
          </Button>
        </div>
      </div>

      {/* Decorative elements - social media icons */}
      <div className="absolute bottom-[-20px] left-[-20px] w-40 h-40 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute top-[-20px] right-[-20px] w-40 h-40 rounded-full bg-purple-500/20 blur-3xl"></div>
    </div>
  );
};

export default HeroSection;
