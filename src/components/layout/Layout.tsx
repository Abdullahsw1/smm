import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}

interface LayoutHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function LayoutHeader({
  title,
  description,
  actions,
}: LayoutHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
      {actions && <div className="mt-4 md:mt-0">{actions}</div>}
    </div>
  );
}

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  return <div>{children}</div>;
}
