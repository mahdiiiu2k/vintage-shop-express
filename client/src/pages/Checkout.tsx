import { useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation } from '@/components/Navigation';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Algerian wilayas and their cities
const ALGERIA_DATA = {
  'Adrar': ['Adrar', 'Reggane', 'In Salah', 'Timimoun', 'Zaouiet Kounta'],
  'Chlef': ['Chlef', 'Ténès', 'Benairia', 'El Karimia', 'Sobha'],
  'Laghouat': ['Laghouat', 'Aflou', 'Ksar El Hirane', 'Brida', 'Gueltat Sidi Saad'],
  'Oum El Bouaghi': ['Oum El Bouaghi', 'Aïn Beïda', 'Aïn M\'lila', 'Sigus', 'El Amiria'],
  'Batna': ['Batna', 'Arris', 'Biskra', 'Barika', 'Merouana'],
  'Béjaïa': ['Béjaïa', 'Akbou', 'Kherrata', 'Sidi Aïch', 'Souk El Tenine'],
  'Biskra': ['Biskra', 'Tolga', 'Sidi Okba', 'Chetma', 'El Kantara'],
  'Béchar': ['Béchar', 'Kenadsa', 'Abadla', 'Igli', 'Taghit'],
  'Blida': ['Blida', 'Boufarik', 'Larbaa', 'Bouinan', 'Soumaa'],
  'Bouira': ['Bouira', 'Lakhdaria', 'M\'Chedallah', 'Sour El Ghouzlane', 'Aïn Bessem'],
  'Tamanrasset': ['Tamanrasset', 'In Guezzam', 'In Salah', 'Abalessa', 'Tin Zaouatine'],
  'Tébessa': ['Tébessa', 'Cheria', 'El Aouinet', 'Bir El Ater', 'Negrine'],
  'Tlemcen': ['Tlemcen', 'Maghnia', 'Remchi', 'Nedroma', 'Sebdou'],
  'Tiaret': ['Tiaret', 'Sougueur', 'Mahdia', 'Frenda', 'Ksar Chellala'],
  'Tizi Ouzou': ['Tizi Ouzou', 'Azazga', 'Draâ Ben Khedda', 'Tigzirt', 'Beni Douala'],
  'Alger': ['Alger', 'Rouiba', 'Dar El Beïda', 'Zéralda', 'Cheraga', 'El Harrach'],
  'Djelfa': ['Djelfa', 'Messaad', 'Aïn Oussera', 'Hassi Bahbah', 'Selmana'],
  'Jijel': ['Jijel', 'Taher', 'El Milia', 'Sidi Abdelaziz', 'Settara'],
  'Sétif': ['Sétif', 'El Eulma', 'Aïn Arnat', 'Bougaa', 'Béni Aziz'],
  'Saïda': ['Saïda', 'Balloul', 'Ouled Brahim', 'Sidi Boubekeur', 'El Hassasna'],
  'Skikda': ['Skikda', 'Collo', 'Azzaba', 'Tamalous', 'Aïn Charchar'],
  'Sidi Bel Abbès': ['Sidi Bel Abbès', 'Tessala', 'Sfisef', 'Aïn Thrid', 'Telagh'],
  'Annaba': ['Annaba', 'El Hadjar', 'Berrahal', 'Aïn Berda', 'Chetaïbi'],
  'Guelma': ['Guelma', 'Bouchegouf', 'Héliopolis', 'Hammam Debagh', 'Oued Zenati'],
  'Constantine': ['Constantine', 'El Khroub', 'Aïn Smara', 'Didouche Mourad', 'Hamma Bouziane'],
  'Médéa': ['Médéa', 'Berrouaghia', 'Ksar El Boukhari', 'Ouzera', 'Aïn Boucif'],
  'Mostaganem': ['Mostaganem', 'Relizane', 'Aïn Tédelès', 'Hassi Mameche', 'Sidi Ali'],
  'M\'Sila': ['M\'Sila', 'Boussaâda', 'Sidi Aïssa', 'Aïn El Hadjel', 'Magra'],
  'Mascara': ['Mascara', 'Sig', 'Mohammadia', 'Ghriss', 'Bouhanifia'],
  'Ouargla': ['Ouargla', 'Touggourt', 'Hassi Messaoud', 'El Hadjira', 'Témacine'],
  'Oran': ['Oran', 'Es Senia', 'Bir El Djir', 'Aïn Türk', 'Bethioua'],
  'El Bayadh': ['El Bayadh', 'Rogassa', 'Stitten', 'Brezina', 'Boualem'],
  'Illizi': ['Illizi', 'Djanet', 'In Aménas', 'Bordj Omar Driss', 'Debdeb'],
  'Bordj Bou Arréridj': ['Bordj Bou Arréridj', 'Ras El Oued', 'Bir Kasdali', 'El Achir', 'Aïn Taghrout'],
  'Boumerdès': ['Boumerdès', 'Dellys', 'Naciria', 'Isser', 'Bordj Menaïel'],
  'El Tarf': ['El Tarf', 'El Kala', 'Bouteldja', 'Ben M\'Hidi', 'Bougous'],
  'Tindouf': ['Tindouf', 'Oum El Assel'],
  'Tissemsilt': ['Tissemsilt', 'Theniet El Had', 'Bordj Bou Naama', 'Lazharia', 'Khemisti'],
  'El Oued': ['El Oued', 'Guemar', 'Reguiba', 'Magrane', 'Still'],
  'Khenchela': ['Khenchela', 'Aïn Touila', 'Kais', 'Baghai', 'El Hamma'],
  'Souk Ahras': ['Souk Ahras', 'Sedrata', 'Haddada', 'Ouled Driss', 'Taoura'],
  'Tipaza': ['Tipaza', 'Koléa', 'Cherchell', 'Hadjout', 'Menaceur'],
  'Mila': ['Mila', 'Ferdjioua', 'Chelghoum Laïd', 'Rouached', 'Hamala'],
  'Aïn Defla': ['Aïn Defla', 'Khemis Miliana', 'El Attaf', 'Boumedfaa', 'Djelida'],
  'Naâma': ['Naâma', 'Mécheria', 'Aïn Sefra', 'Tiout', 'Sfissifa'],
  'Aïn Témouchent': ['Aïn Témouchent', 'Hammam Bouhadjar', 'Beni Saf', 'El Malah', 'Ouled Kihal'],
  'Ghardaïa': ['Ghardaïa', 'El Meniaa', 'Berriane', 'Metlili', 'Guerrara'],
  'Relizane': ['Relizane', 'Oued Rhiou', 'Mascara', 'Mazouna', 'Yellel']
};

const Checkout = () => {
  const [, setLocation] = useLocation();
  const { getTotalItems, clearCart, cartItems } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    streetAddress: '',
    state: 'Alger',
    city: '',
    phone: '',
    email: '',
    orderNotes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // If state changes, reset city
      if (field === 'state') {
        newData.city = '';
      }
      
      return newData;
    });
  };

  // Get available cities based on selected state
  const availableCities = useMemo(() => {
    return formData.state ? ALGERIA_DATA[formData.state as keyof typeof ALGERIA_DATA] || [] : [];
  }, [formData.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.streetAddress || !formData.state || !formData.city || !formData.phone || !formData.email) {
      toast({
        title: "Please fill in all required fields",
        description: "All fields marked with * are required.",
        variant: "destructive"
      });
      return;
    }

    // Check if cart is empty
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Prepare order data for Google Sheets
      const orderData = {
        billingDetails: {
          name: formData.name,
          wilaya: formData.state,
          city: formData.city,
          streetAddress: formData.streetAddress,
          phone: formData.phone,
          email: formData.email,
          orderNotes: formData.orderNotes
        },
        items: cartItems.map(item => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            category: item.product.category,
            description: item.product.description
          },
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          quantity: item.quantity
        }))
      };

      // Submit order to Google Sheets
      const response = await apiRequest('/api/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.success) {
        toast({
          title: "Order completed successfully!",
          description: "Your order has been placed and will be delivered soon.",
        });
        
        // Clear cart and redirect
        clearCart();
        setLocation('/');
      } else {
        throw new Error(response.error || 'Failed to submit order');
      }
      
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: "Order failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartItemCount={getTotalItems()} />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Billing Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="state">Wilaya *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="streetAddress">Street address *</Label>
                <Input
                  id="streetAddress"
                  placeholder="House number and street name"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="orderNotes">Order notes (optional)</Label>
                <Textarea
                  id="orderNotes"
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  value={formData.orderNotes}
                  onChange={(e) => handleInputChange('orderNotes', e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Done
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;