
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface NavigationProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  cartItems: any[];
  onCartClick: () => void;
}

const Navigation = ({ searchTerm, setSearchTerm, cartItems, onCartClick }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-200">
              VintageStyle
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-all duration-200 relative ${
                isActive('/') 
                  ? 'text-gray-900 font-semibold after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className={`transition-all duration-200 relative ${
                isActive('/shop') 
                  ? 'text-gray-900 font-semibold after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className={`transition-all duration-200 relative ${
                isActive('/about') 
                  ? 'text-gray-900 font-semibold after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`transition-all duration-200 relative ${
                isActive('/contact') 
                  ? 'text-gray-900 font-semibold after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative group">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-gray-600" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-64 hidden md:block border-gray-200 focus:border-gray-400 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              className="relative hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-pulse">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            
            <Button
              variant="ghost"
              className="md:hidden hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-t transition-all duration-300 ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-4 py-2 space-y-2">
          <Input
            type="text"
            placeholder="Search products..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex flex-col space-y-2">
            <Link to="/" className="block px-3 py-2 text-gray-900 hover:bg-gray-50 rounded-md transition-colors">Home</Link>
            <Link to="/shop" className="block px-3 py-2 text-gray-900 hover:bg-gray-50 rounded-md transition-colors">Shop</Link>
            <Link to="/about" className="block px-3 py-2 text-gray-900 hover:bg-gray-50 rounded-md transition-colors">About</Link>
            <Link to="/contact" className="block px-3 py-2 text-gray-900 hover:bg-gray-50 rounded-md transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
