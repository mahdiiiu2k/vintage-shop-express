import { useState } from 'react';
import { Plus, Eye, ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string) => void;
  className?: string;
}

export const ProductCard = ({ product, onAddToCart, className }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddToCartOpen, setIsAddToCartOpen] = useState(false);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select size and color",
        description: "Both size and color are required to add item to cart.",
        variant: "destructive",
      });
      return;
    }

    onAddToCart(product, selectedSize, selectedColor);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
    
    // Close the modal after successful add to cart
    setIsAddToCartOpen(false);
  };

  const handleQuickOrder = () => {
    // Use default selections for quick order
    const defaultSize = product.sizes[0] || '';
    const defaultColor = product.colors[0] || '';
    
    if (!defaultSize || !defaultColor) {
      toast({
        title: "Quick order unavailable",
        description: "This product requires size and color selection.",
        variant: "destructive",
      });
      return;
    }

    onAddToCart(product, defaultSize, defaultColor);
    toast({
      title: "Quick order successful!",
      description: `${product.name} (${defaultSize}, ${defaultColor}) added to cart instantly.`,
    });
  };



  return (
    <Card className={cn(
      "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 border-border",
      className
    )}>
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `${window.location.origin}${product.image_url}`) : "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop"}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('unsplash')) {
                target.src = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop";
              }
            }}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {product.category && (
            <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground">
              {product.category}
            </Badge>
          )}
        </div>
        
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>

          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-foreground">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>

          <div className="flex gap-1 w-full min-w-0">
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 text-xs sm:text-sm px-2 sm:px-3 min-w-0">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span className="hidden sm:inline">Details</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">{product.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <img
                        src={product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `${window.location.origin}${product.image_url}`) : "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop"}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes('unsplash')) {
                            target.src = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop";
                          }
                        }}
                        alt={product.name}
                        className="w-full h-48 sm:h-64 object-cover rounded-lg"
                      />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <span className="text-2xl sm:text-3xl font-bold text-foreground">
                          ¥{product.price.toLocaleString()}
                        </span>

                      </div>
                      
                      <p className="text-muted-foreground">{product.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Size</label>
                          <Select value={selectedSize} onValueChange={setSelectedSize}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              {product.sizes.map(size => (
                                <SelectItem key={size} value={size}>{size}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
                          <Select value={selectedColor} onValueChange={setSelectedColor}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                              {product.colors.map(color => (
                                <SelectItem key={color} value={color}>{color}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button 
                          onClick={() => {
                            handleAddToCart();
                            setIsDetailsOpen(false);
                          }} 
                          className="w-full" 
                          size="lg"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button 
                          onClick={() => {
                            handleQuickOrder();
                            setIsDetailsOpen(false);
                          }} 
                          className="w-full bg-green-600 hover:bg-green-700 text-white" 
                          size="lg"
                        >
                          <Package className="w-4 h-4 mr-2" />
                          Quick Order
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-foreground mb-2">Product Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <span className="ml-2 font-medium">{product.category}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Available Sizes:</span>
                        <span className="ml-2 font-medium">{product.sizes.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Available Colors:</span>
                        <span className="ml-2 font-medium">{product.colors.join(', ')}</span>
                      </div>

                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              onClick={handleQuickOrder}
              className="flex-1 text-xs sm:text-sm px-2 sm:px-3 min-w-0 bg-green-600 hover:bg-green-700 text-white border-0"
            >
              <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
              <span className="hidden sm:inline">Order</span>
            </Button>
            
            <Dialog open={isAddToCartOpen} onOpenChange={setIsAddToCartOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm px-2 sm:px-3 min-w-0">
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{product.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <img
                    src={product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `${window.location.origin}${product.image_url}`) : "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop"}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('unsplash')) {
                        target.src = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop";
                      }
                    }}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Size</label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.sizes.map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
                      <Select value={selectedColor} onValueChange={setSelectedColor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.colors.map(color => (
                            <SelectItem key={color} value={color}>{color}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-foreground">
                      ¥{product.price.toLocaleString()}
                    </span>
                    <Button onClick={handleAddToCart} className="px-6">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};