import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Megaphone, BookOpen, MessageCircle, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
  { title: "Home", url: "/dashboard", icon: LayoutDashboard },
  { title: "News", url: "/announcements", icon: Megaphone },
  { title: "Courses", url: "/courses", icon: BookOpen },
  { title: "Discuss", url: "/discussions", icon: MessageCircle },
  { title: "More", url: "/settings", icon: Menu },
];

export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-2 pb-safe">
      <div className="flex items-center justify-around py-2">
        {mobileItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <button
              key={item.url}
              onClick={() => navigate(item.url)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
