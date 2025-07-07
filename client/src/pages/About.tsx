import { useState } from 'react';
import { Users, Award, Heart, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { useCart } from '@/hooks/useCart';

const About = () => {

  const { getTotalItems } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        cartItemCount={getTotalItems()}
      />

      {/* About Hero */}
      <section className="bg-gradient-to-r from-background to-accent py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Our Story
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
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
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Crafting Timeless Fashion
              </h2>
              <p className="text-muted-foreground mb-6">
                Since our founding in 2020, VintageStyle has been dedicated to creating 
                clothing that transcends trends. We believe in the power of well-made 
                garments that tell a story and build confidence.
              </p>
              <p className="text-muted-foreground mb-6">
                Our team of designers and craftspeople work tirelessly to source the 
                finest materials and employ time-honored techniques that ensure every 
                piece meets our exacting standards.
              </p>
              <p className="text-muted-foreground">
                From our headquarters in Tokyo, we ship worldwide, bringing you fashion 
                that's both contemporary and classic, modern yet timeless.
              </p>
            </div>
            
            {/* Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
                alt="VintageStyle Workshop"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-primary/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do, from design to delivery.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Quality First</h3>
                <p className="text-muted-foreground text-sm">
                  Every piece is crafted with attention to detail and built to last.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Sustainable</h3>
                <p className="text-muted-foreground text-sm">
                  We're committed to ethical production and environmental responsibility.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Community</h3>
                <p className="text-muted-foreground text-sm">
                  Building relationships with customers, suppliers, and our team.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Global Reach</h3>
                <p className="text-muted-foreground text-sm">
                  Serving customers worldwide with local care and attention.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind VintageStyle's success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                  alt="Team Member"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold mb-1">Hiroshi Tanaka</h3>
                <p className="text-primary text-sm mb-2">Founder & Creative Director</p>
                <p className="text-muted-foreground text-sm">
                  With 15 years in fashion design, Hiroshi brings vision and expertise to every collection.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=200&h=200&fit=crop&crop=face"
                  alt="Team Member"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold mb-1">Sarah Chen</h3>
                <p className="text-primary text-sm mb-2">Head of Design</p>
                <p className="text-muted-foreground text-sm">
                  Sarah's innovative approach to sustainable fashion drives our design philosophy.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
                  alt="Team Member"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold mb-1">Marcus Johnson</h3>
                <p className="text-primary text-sm mb-2">Quality Director</p>
                <p className="text-muted-foreground text-sm">
                  Marcus ensures every piece meets our high standards before it reaches you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">
            &copy; 2025 VintageStyle. Crafting timeless fashion with care.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;