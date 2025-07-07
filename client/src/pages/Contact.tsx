
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      toast({
        title: "Please fill in all required fields",
        description: "Name, email, and message are required.",
      });
    }
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
              <Link to="/contact" className="text-gray-900 hover:text-gray-600 transition font-semibold">Contact</Link>
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
              
              <Button variant="outline">
                <ShoppingCart className="w-5 h-5" />
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
                <Link to="/contact" className="block px-3 py-2 text-gray-900 hover:bg-gray-50 font-semibold">Contact</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Contact Hero */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Have questions about our products or need assistance? We're here to help. 
            Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  size="lg" 
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <MapPin className="w-6 h-6 text-gray-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Our Location</h3>
                        <p className="text-gray-600">
                          123 Fashion Street<br />
                          Algiers, Algeria<br />
                          16000
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Phone className="w-6 h-6 text-gray-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                        <p className="text-gray-600">+213 555 123 456</p>
                        <p className="text-gray-600">+213 555 789 012</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Mail className="w-6 h-6 text-gray-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                        <p className="text-gray-600">info@vintagestyle.com</p>
                        <p className="text-gray-600">support@vintagestyle.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Clock className="w-6 h-6 text-gray-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                        <p className="text-gray-600">
                          Monday - Friday: 9:00 AM - 6:00 PM<br />
                          Saturday: 10:00 AM - 4:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our products, shipping, and policies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">What is your return policy?</h3>
                <p className="text-gray-600">
                  We offer a 30-day return policy for all unworn items in original condition. 
                  Please contact us to initiate a return.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">How long does shipping take?</h3>
                <p className="text-gray-600">
                  Standard shipping within Algeria takes 3-5 business days. Express shipping 
                  is available for next-day delivery in major cities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Do you offer international shipping?</h3>
                <p className="text-gray-600">
                  Currently, we only ship within Algeria. We're working on expanding 
                  international shipping options.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">How can I track my order?</h3>
                <p className="text-gray-600">
                  You'll receive a tracking number via email once your order ships. 
                  Use this number to track your package on our website.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
