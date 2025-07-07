
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const About = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
              <Link to="/about" className="text-gray-900 hover:text-gray-600 transition font-semibold">About</Link>
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
                <Link to="/about" className="block px-3 py-2 text-gray-900 hover:bg-gray-50 font-semibold">About</Link>
                <Link to="/contact" className="block px-3 py-2 text-gray-900 hover:bg-gray-50">Contact</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* About Hero */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Our Story
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Founded on the belief that quality clothing should be accessible to everyone, 
            VintageStyle brings you carefully curated pieces that stand the test of time.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Quality & Craftsmanship
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At VintageStyle, we believe in the power of quality craftsmanship. Every piece in our collection 
                is carefully selected for its superior materials, attention to detail, and timeless design. 
                We work with skilled artisans and trusted manufacturers who share our commitment to excellence.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our journey began with a simple vision: to create a brand that celebrates individuality while 
                maintaining the highest standards of quality. We source premium fabrics from around the world 
                and ensure that every garment meets our rigorous quality standards.
              </p>
              <Button 
                asChild
                size="lg" 
                className="bg-black text-white hover:bg-gray-800"
              >
                <Link to="/shop">Explore Our Collection</Link>
              </Button>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=400&fit=crop"
                alt="About VintageStyle"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do, from product selection to customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainability</h3>
                <p className="text-gray-600">
                  We're committed to sustainable practices, working with eco-friendly materials 
                  and ethical manufacturing processes to minimize our environmental impact.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quality</h3>
                <p className="text-gray-600">
                  Every piece is crafted with attention to detail and built to last. We believe 
                  in creating timeless wardrobe staples that you'll love for years to come.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Accessibility</h3>
                <p className="text-gray-600">
                  Premium quality shouldn't be exclusive. We strive to make beautiful, 
                  well-made clothing accessible to everyone at fair prices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind VintageStyle who work tirelessly to bring you the best in fashion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop"
                alt="Team member"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah Johnson</h3>
              <p className="text-gray-600 mb-2">Creative Director</p>
              <p className="text-sm text-gray-500">
                Sarah brings over 10 years of fashion industry experience to our creative vision.
              </p>
            </div>

            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=300&fit=crop"
                alt="Team member"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ahmed Benali</h3>
              <p className="text-gray-600 mb-2">Head of Operations</p>
              <p className="text-sm text-gray-500">
                Ahmed ensures every order is processed with care and delivered with excellence.
              </p>
            </div>

            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=300&fit=crop"
                alt="Team member"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Maria Rodriguez</h3>
              <p className="text-gray-600 mb-2">Quality Manager</p>
              <p className="text-sm text-gray-500">
                Maria oversees our quality control processes to ensure every piece meets our standards.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
