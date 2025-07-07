
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Search, Menu, X, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

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
  description: string;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

const Shop = () => {
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
      colors: ["White", "Black", "Blue"],
      description: "Premium cotton shirt perfect for any occasion. Comfortable fit and elegant design."
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
      colors: ["Blue", "Black"],
      description: "Classic denim jacket with vintage styling. Durable and timeless design."
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
      colors: ["Black", "Navy", "Burgundy"],
      description: "Sophisticated black dress suitable for formal events and special occasions."
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
      colors: ["White", "Black", "Gray", "Navy"],
      description: "Comfortable cotton t-shirt for everyday wear. Soft fabric and relaxed fit."
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
      colors: ["Floral", "White"],
      description: "Beautiful floral dress perfect for summer occasions. Light and airy fabric."
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
      colors: ["Beige", "Gray", "Navy"],
      description: "Luxurious wool sweater for cold weather. Warm and stylish design."
    },
    {
      id: 7,
      name: "Leather Boots",
      price: 9500,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
      rating: 5,
      reviews: 18,
      category: "Shoes",
      sizes: ["38", "39", "40", "41", "42", "43"],
      colors: ["Brown", "Black"],
      description: "Handcrafted leather boots with superior comfort and durability."
    },
    {
      id: 8,
      name: "Silk Scarf",
      price: 3200,
      image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=500&fit=crop",
      rating: 4,
      reviews: 9,
      category: "Accessories",
      sizes: ["One Size"],
      colors: ["Blue", "Red", "Green", "Gold"],
      description: "Luxurious silk scarf perfect for adding elegance to any outfit."
    }
  ]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const categories = ['All', 'Shirts', 'Jackets', 'Dresses', 'T-Shirts', 'Sweaters', 'Shoes', 'Accessories'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product, size: string, color: string) => {
    const existingItem = cartItems.find(
      item => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
    );

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        product,
        quantity: 1,
        selectedSize: size,
        selectedColor: color
      };
      setCartItems([...cartItems, newItem]);
    }

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
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

  const ProductCard = ({ product }: { product: Product }) => {
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);

    return (
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
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
          <p className="text-sm text-gray-600 mb-3">{product.description}</p>
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
          
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {product.colors.map((color) => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            onClick={() => addToCart(product, selectedSize, selectedColor)}
            className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    );
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
              <Link to="/shop" className="text-gray-900 hover:text-gray-600 transition font-semibold">Shop</Link>
              <Link to="/about" className="text-gray-900 hover:text-gray-600 transition">About</Link>
              <Link to="/contact" className="text-gray-900 hover:text-gray-600 transition">Contact</Link>
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
              
              <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItems.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cartItems.reduce((total, item) => total + item.quantity, 0)}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Shopping Cart</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {cartItems.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">Your cart is empty</p>
                    ) : (
                      <>
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.product.name}</h4>
                              <p className="text-sm text-gray-600">
                                Size: {item.selectedSize}, Color: {item.selectedColor}
                              </p>
                              <p className="font-bold">{formatPrice(item.product.price)}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-bold">Total: {formatPrice(getTotalPrice())}</span>
                          </div>
                          <Button className="w-full bg-black text-white hover:bg-gray-800">
                            Proceed to Checkout
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              
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
                <Link to="/shop" className="block px-3 py-2 text-gray-900 hover:bg-gray-50 font-semibold">Shop</Link>
                <Link to="/about" className="block px-3 py-2 text-gray-900 hover:bg-gray-50">About</Link>
                <Link to="/contact" className="block px-3 py-2 text-gray-900 hover:bg-gray-50">Contact</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Shop Header */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop Our Collection
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover premium clothing pieces that define your unique style
          </p>
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
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
