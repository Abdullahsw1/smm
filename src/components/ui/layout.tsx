import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className = "" }: LayoutProps) {
  return (
    <div className={`flex flex-col min-h-screen ${className}`}>{children}</div>
  );
}

export function LayoutHeader({ children, className = "" }: LayoutProps) {
  return <header className={`py-4 ${className}`}>{children}</header>;
}

export function LayoutContent({ children, className = "" }: LayoutProps) {
  return <main className={`flex-1 ${className}`}>{children}</main>;
}
