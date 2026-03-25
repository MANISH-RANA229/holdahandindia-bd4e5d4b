/**
 * HomeNavbar — sticky top navigation for the public landing page.
 * Contains logo, theme toggle, and auth links.
 */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function HomeNavbar() {
  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg hero-gradient flex items-center justify-center">
            <Heart className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">
            Hold A Hand India
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          {/* "tertiary" look via hero-gradient utility */}
          <Button size="sm" variant="gradient" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
