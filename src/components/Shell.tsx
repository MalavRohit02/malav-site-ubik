import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { FloatingChat } from "./FloatingChat";
import { CommandPalette } from "./CommandPalette";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const [chatFocused, setChatFocused] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 relative">
          <TopBar />
          <main className="flex-1 overflow-auto pb-28 relative">
            {/* Focus overlay */}
            {chatFocused && (
              <div
                className="absolute inset-0 bg-background/60 z-40 transition-opacity duration-200"
                onClick={() => setChatFocused(false)}
              />
            )}
            {children}
          </main>
          <FloatingChat onFocusChange={setChatFocused} />
        </div>
      </div>
      <CommandPalette />
    </SidebarProvider>
  );
}
