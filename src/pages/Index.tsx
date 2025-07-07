
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  sizes: string[];
  colors: string[];
}

const Index = () => {
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Classic White Shirt",
      price: 4750,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
      rating: 5,
      reviews: 12,
      category: "Shirts",
      sizes: ["S", "M", "L", "XL"],
      colors: ["White", "Black", "Blue"]
    },
    {
      id: 2,
      name: "Vintage Denim Jacket",
      price: 8900,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
      rating: 4,
      reviews: 8,
      category: "Jackets",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blue", "Black"]
    },
    {
      id: 3,
      name: "Elegant Black Dress",
      price: 6200,
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop",
      rating: 5,
      reviews: 15,
      category: "Dresses",
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "Navy", "Burgundy"]
    },
    {
      id: 4,
      name: "Casual Cotton T-Shirt",
      price: 2850,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
      rating: 4,
      reviews: 23,
      category: "T-Shirts",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["White", "Black", "Gray", "Navy"]
    },
    {
      id: 5,
      name: "Summer Floral Dress",
      price: 5500,
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
      rating: 5,
      reviews: 7,
      category: "Dresses",
      sizes: ["XS", "S", "M", "L"],
      colors: ["Floral", "White"]
    },
    {
      id: 6,
      name: "Premium Wool Sweater",
      price: 7200,
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop",
      rating: 4,
      reviews: 11,
      category: "Sweaters",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Beige", "Gray", "Navy"]
    }
  ]);

  const [cartItems, setCartItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = ['All', 'Shirts', 'Jackets', 'Dresses', 'T-Shirts', 'Sweaters'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: number) => {
    setCartItems([...cartItems, productId]);
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()}.00د.ج`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                VintageStyle
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-900 hover:text-gray-600 transition">Home</Link>
              <Link to="/shop" className="text-gray-900 hover:text-gray-600 transition">Shop</Link>
              <Link to="/about" className="text-gray-900 hover:text-gray-600 transition">About</Link>
              <Link to="/contact" className="text-gray-900 hover:text-gray-600 transition">Contact</Link>
              <Link to="/admin" className="text-gray-900 hover:text-gray-600 transition">Admin</Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 w-64 hidden md:block"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <Input
                type="text"
                placeholder="Search products..."
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex flex-col space-y-2">
                <Link to="/" className="block px-3 py-2 text-gray-900 hover:bg-gray-50">Home</Link>
                <Link to="/shop" className="block px-3 py-2 text-gray-900 hover:bg-gray-50">Shop</Link>
                <Link to="/about" className="block px-3 py-2 text-gray-900 hover:bg-gray-50">About</Link>
                <Link to="/contact" className="block px-3 py-2 text-gray-900 hover:bg-gray-50">Contact</Link>
                <Link to="/admin" className="block px-3 py-2 text-gray-900 hover:bg-gray-50">Admin</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Your Style
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Curated collection of premium clothing for the modern wardrobe. 
            Quality pieces that define your unique aesthetic.
          </p>
          <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-3">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="transition-all"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center mr-2">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  <Button
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay in Style</h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to our newsletter for the latest fashion trends and exclusive offers.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button className="bg-black text-white hover:bg-gray-800">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">VintageStyle</h3>
              <p className="text-gray-400">
                Premium clothing for the modern wardrobe. Quality pieces that define your style.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                <li><Link to="/shop" className="hover:text-white transition">Shop</Link></li>
                <li><Link to="/about" className="hover:text-white transition">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Shirts</a></li>
                <li><a href="#" className="hover:text-white transition">Dresses</a></li>
                <li><a href="#" className="hover:text-white transition">Jackets</a></li>
                <li><a href="#" className="hover:text-white transition">Accessories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@vintagestyle.com</li>
                <li>Phone: +213 555 123 456</li>
                <li>Address: Algiers, Algeria</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VintageStyle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
