/**
 * HomeFooter — simple footer with logo, copyright, and quick links.
 */
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export function HomeFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
              <Heart className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Hold A Hand India</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © 2025 Hold A Hand India. A non-profit mentorship initiative. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link to="/login" className="hover:text-primary transition-colors">Mentor Login</Link>
            <Link to="/signup" className="hover:text-primary transition-colors">Student Sign Up</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
