import { useState, useEffect } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { ProductCard } from '@/components/ProductCard';
import { Loading, ProductCardSkeleton } from '@/components/Loading';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState('all');
  const { addToCart, getTotalItems } = useCart();
  const { toast } = useToast();

  // Simulate loading products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setProducts([
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
          name: "Slim Fit Chinos",
          price: 3900,
          image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
          rating: 4,
          reviews: 18,
          category: "Pants",
          sizes: ["28", "30", "32", "34", "36"],
          colors: ["Khaki", "Navy", "Black"],
          description: "Versatile chinos perfect for casual and semi-formal occasions."
        },
        {
          id: 8,
          name: "Leather Crossbody Bag",
          price: 6800,
          image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop",
          rating: 5,
          reviews: 9,
          category: "Accessories",
          sizes: ["One Size"],
          colors: ["Brown", "Black", "Tan"],
          description: "Handcrafted leather bag with adjustable strap. Perfect for daily use."
        }
      ]);
      setLoading(false);
    };

    loadProducts();
  }, []);

  const categories = ['All', 'Shirts', 'Jackets', 'Dresses', 'T-Shirts', 'Sweaters', 'Pants', 'Accessories'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange === 'under-3000') matchesPrice = product.price < 3000;
    else if (priceRange === '3000-5000') matchesPrice = product.price >= 3000 && product.price <= 5000;
    else if (priceRange === '5000-8000') matchesPrice = product.price >= 5000 && product.price <= 8000;
    else if (priceRange === 'over-8000') matchesPrice = product.price > 8000;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        cartItemCount={getTotalItems()}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Shop Collection</h1>
          <p className="text-muted-foreground">
            Discover our curated selection of timeless fashion pieces.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Price Range</label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-3000">Under ¥3,000</SelectItem>
                  <SelectItem value="3000-5000">¥3,000 - ¥5,000</SelectItem>
                  <SelectItem value="5000-8000">¥5,000 - ¥8,000</SelectItem>
                  <SelectItem value="over-8000">Over ¥8,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">View</label>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {sortedProducts.length} products found
            </span>
            {selectedCategory !== 'All' && (
              <Badge variant="secondary" className="ml-2">
                {selectedCategory}
              </Badge>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          )}>
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          )}>
            {sortedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                className={viewMode === 'list' ? 'flex flex-row' : ''}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms.
            </p>
            <Button onClick={() => {
              setSelectedCategory('All');
              setPriceRange('all');
              setSearchTerm('');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;