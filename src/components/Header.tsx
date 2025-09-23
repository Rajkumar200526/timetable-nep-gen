import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, Home, FileText } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg hero-gradient glow-effect group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Timetable
              </h1>
              <p className="text-xs text-muted-foreground">NEP 2020 Compatible</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              asChild
              className={isActive("/") ? "hero-gradient text-white" : ""}
            >
              <Link to="/" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive("/form") ? "default" : "ghost"}
              size="sm"
              asChild
              className={isActive("/form") ? "hero-gradient text-white" : ""}
            >
              <Link to="/form" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Create Timetable</span>
              </Link>
            </Button>

            {location.pathname === "/result" && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="bg-accent/10 text-accent-foreground border border-accent/20"
              >
                <Link to="/result" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>View Results</span>
                </Link>
              </Button>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/form">
                <Calendar className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;