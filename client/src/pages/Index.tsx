import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Star, ArrowRight, Sparkles, Shield, Truck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { ProductCard } from '@/components/ProductCard';
import { Loading, ProductCardSkeleton } from '@/components/Loading';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: string;
  image_url: string;
  description: string;
  category: string;
  sizes: string[];
  colors: string[];
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, getTotalItems } = useCart();
  const { toast } = useToast();

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          // Take only first 6 products for homepage
          setProducts(data.slice(0, 6));
        } else {
          throw new Error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to sample products if API fails (including your admin product)
        setProducts([
        {
          id: 1,
          name: "Make API 1",
          price: 5000,
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop",
          rating: 5,
          reviews: 12,
          category: "Sports",
          sizes: ["XS", "S", "M", "L"],
          colors: ["Red", "Blue", "Green"],
          description: "Your first product from the admin dashboard - now displaying in the shop!"
        },
        {
          id: 2,
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
        }
      ]);
      }
      setLoading(false);
    };

    loadProducts();
  }, []);

  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation 
        cartItemCount={getTotalItems()}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-background to-accent py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23000\" fill-opacity=\"0.05\" fill-rule=\"evenodd\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"3\"/%3E%3Ccircle cx=\"13\" cy=\"13\" r=\"3\"/%3E%3C/g%3E%3C/svg%3E')",
            width: '100%',
            height: '100%'
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">New Collection Available</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Discover Your
            <span className="text-primary"> Vintage Style</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Curated collection of timeless pieces that blend classic elegance with modern comfort. 
            Find your perfect style statement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Shop Collection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Carefully selected materials and craftsmanship ensuring lasting quality and comfort.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Quick and reliable shipping with tracking. Free delivery on orders over ¥10,000.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
              <p className="text-muted-foreground">
                30-day return policy with hassle-free exchanges and full refunds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked selections from our latest collection. Each piece tells a story of timeless elegance.
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[...Array(3)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {featuredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/shop">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for exclusive offers, new arrivals, and style inspiration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">VintageStyle</h3>
              <p className="text-muted-foreground">
                Timeless fashion for the modern individual. Quality craftsmanship meets contemporary style.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link></li>
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Customer Service</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
              <p className="text-muted-foreground">
                Stay connected for the latest updates and exclusive offers.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2025 VintageStyle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;