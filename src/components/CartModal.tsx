
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface CartItem {
  id: number;
  product: any;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
}

const CartModal = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }: CartModalProps) => {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()}.00د.ج`;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 bg-white">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6" />
            <span>Shopping Cart ({getTotalItems()} items)</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 px-6">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-center mb-6">Add some products to get started</p>
              <Button onClick={onClose} className="bg-black text-white hover:bg-gray-800">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-6">
                <div className="space-y-4 py-4">
                  {cartItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="relative">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{item.product.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Size: <span className="font-medium">{item.selectedSize}</span> • 
                            Color: <span className="font-medium">{item.selectedColor}</span>
                          </p>
                          <p className="font-bold text-lg text-gray-900 mt-2">
                            {formatPrice(item.product.price)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0 hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          
                          <span className="w-12 text-center font-semibold text-lg">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0 hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRemoveItem(item.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {index < cartItems.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="border-t bg-white p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Total ({getTotalItems()} items)</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatPrice(getTotalPrice())}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-gray-800 to-black text-white hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 h-12 text-lg font-semibold"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onClose}
                    className="w-full hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
