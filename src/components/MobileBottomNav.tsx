import { useNavigate, useLocation } from "react-router-dom";
import { Home, BarChart3, MessageCircle, Clock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/reports", icon: BarChart3, label: "Reports" },
    { path: "/ai-coach", icon: MessageCircle, label: "AI Coach" },
    { path: "/history", icon: Clock, label: "History" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 z-50 shadow-luxury">
      <div className="flex items-center justify-around py-3 px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;