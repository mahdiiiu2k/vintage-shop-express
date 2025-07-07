import { useState } from 'react';
import { Star, Plus, Heart } from 'lucide-react';
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
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  sizes: string[];
  colors: string[];
  description: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string) => void;
  className?: string;
}

export const ProductCard = ({ product, onAddToCart, className }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
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
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
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
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={toggleWishlist}
            >
              <Heart className={cn("w-4 h-4 transition-colors", isWishlisted && "fill-red-500 text-red-500")} />
            </Button>
          </div>
          {product.category && (
            <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground">
              {product.category}
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-foreground">
              ¥{product.price.toLocaleString()}
            </span>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{product.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={product.image}
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
      </CardContent>
    </Card>
  );
};