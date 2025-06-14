import { useNavigate, useLocation } from "react-router-dom";
import { Home, BarChart3, MessageCircle, Clock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/reports", icon: BarChart3, label: "Reports" },
    { path: "/ai-coach", icon: MessageCircle, label: "Coach" },
    { path: "/history", icon: Clock, label: "History" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-50 shadow-lg">
      <div className="flex items-center justify-around py-3 px-4 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-0 flex-1",
                isActive
                  ? "text-primary bg-primary/10 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-1 transition-all", isActive && "scale-110")} />
              <span className={cn("text-xs font-medium", isActive ? "font-semibold" : "font-normal")}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;