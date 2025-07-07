import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

interface NavigationProps {
  cartItemCount?: number;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
  className?: string;
}

export const Navigation = ({ 
  cartItemCount = 0, 
  searchTerm = '', 
  onSearchChange,
  showSearch = false,
  className 
}: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className={cn(
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50 transition-all duration-300",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
              VintageStyle
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                href={path}
                className={cn(
                  "text-foreground/80 hover:text-foreground transition-colors relative",
                  isActive(path) && "text-foreground font-medium"
                )}
              >
                {label}
                {isActive(path) && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            {showSearch && (
              <div className="relative hidden md:block">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 w-64 bg-background border-border focus:border-primary transition-colors"
                  value={searchTerm}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
              </div>
            )}
            
            {/* Mobile Search Button - only show on shop page */}
            {showSearch && (
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden h-10 w-10"
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  // Focus search input when menu opens
                  setTimeout(() => {
                    const searchInput = document.querySelector('input[placeholder="Search products..."]') as HTMLInputElement;
                    if (searchInput && isMobileMenuOpen === false) {
                      searchInput.focus();
                    }
                  }, 100);
                }}
              >
                <Search className="w-5 h-5" />
              </Button>
            )}
            
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            
            <Link href="/cart">
              <Button variant="outline" className="relative h-10 w-10 md:h-auto md:w-auto md:px-3">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* Mobile Theme Toggle */}
            <div className="md:hidden">
              <ThemeToggle />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-in slide-in-from-top-2 duration-300">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search - only show on shop page */}
            {showSearch && (
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 h-12 text-base bg-background border-border"
                  value={searchTerm}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
              </div>
            )}
            
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-1">
              {navItems.map(({ path, label }) => (
                <Link
                  key={path}
                  href={path}
                  className={cn(
                    "block px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-colors text-base font-medium",
                    isActive(path) && "text-foreground bg-accent"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};