
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Package, Users, DollarSign, TrendingUp } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
  description: string;
  sizes: string[];
  colors: string[];
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  products: string[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Classic White Shirt",
      price: 4750,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
      category: "Shirts",
      stock: 25,
      status: 'active',
      description: "Premium cotton white shirt perfect for any occasion.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["White", "Black", "Blue"]
    },
    {
      id: 2,
      name: "Vintage Denim Jacket",
      price: 8900,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
      category: "Jackets",
      stock: 12,
      status: 'active',
      description: "Classic denim jacket with vintage styling and premium quality.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blue", "Black"]
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1001,
      customerName: "Ahmed Benali",
      customerEmail: "ahmed@email.com",
      products: ["Classic White Shirt", "Vintage Denim Jacket"],
      total: 13650,
      status: 'pending',
      date: "2024-01-15"
    },
    {
      id: 1002,
      customerName: "Sara Mansouri",
      customerEmail: "sara@email.com",
      products: ["Elegant Black Dress"],
      total: 6200,
      status: 'processing',
      date: "2024-01-14"
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    image: '',
    sizes: '',
    colors: ''
  });

  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.category) {
      const product: Product = {
        id: Date.now(),
        name: newProduct.name,
        price: parseInt(newProduct.price),
        category: newProduct.category,
        stock: parseInt(newProduct.stock) || 0,
        status: 'active',
        description: newProduct.description,
        image: newProduct.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop",
        sizes: newProduct.sizes.split(',').map(s => s.trim()).filter(s => s),
        colors: newProduct.colors.split(',').map(c => c.trim()).filter(c => c)
      };
      
      setProducts([...products, product]);
      setNewProduct({
        name: '',
        price: '',
        category: '',
        stock: '',
        description: '',
        image: '',
        sizes: '',
        colors: ''
      });
      setIsAddingProduct(false);
    }
  };

  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const toggleProductStatus = (productId: number) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
        : product
    ));
  };

  const deleteProduct = (productId: number) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()}.00د.ج`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate stats
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const newOrders = orders.filter(order => order.status === 'pending').length;
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your clothing store</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(totalSales)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{newOrders}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Products</p>
                  <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
              <Button onClick={() => setIsAddingProduct(true)} className="bg-black text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {isAddingProduct && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (د.ج)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="Enter price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Shirts">Shirts</SelectItem>
                          <SelectItem value="Dresses">Dresses</SelectItem>
                          <SelectItem value="Jackets">Jackets</SelectItem>
                          <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                          <SelectItem value="Sweaters">Sweaters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        placeholder="Enter stock quantity"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sizes">Available Sizes (comma-separated)</Label>
                      <Input
                        id="sizes"
                        value={newProduct.sizes}
                        onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})}
                        placeholder="S, M, L, XL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="colors">Available Colors (comma-separated)</Label>
                      <Input
                        id="colors"
                        value={newProduct.colors}
                        onChange={(e) => setNewProduct({...newProduct, colors: e.target.value})}
                        placeholder="Red, Blue, Black"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Enter product description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      placeholder="Enter image URL"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddProduct} className="bg-black text-white">
                      Add Product
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className={`absolute top-2 right-2 ${getStatusColor(product.status)}`}>
                      {product.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Stock: {product.stock}</p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleProductStatus(product.id)}
                      >
                        {product.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                        <p className="text-gray-600">{order.customerName} - {order.customerEmail}</p>
                        <p className="text-sm text-gray-500">Date: {order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatPrice(order.total)}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Products:</p>
                      <ul className="text-sm text-gray-600">
                        {order.products.map((product, index) => (
                          <li key={index}>• {product}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex space-x-2">
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        Print Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shop Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shop-name">Shop Name</Label>
                    <Input id="shop-name" defaultValue="VintageStyle" />
                  </div>
                  <div>
                    <Label htmlFor="shop-email">Contact Email</Label>
                    <Input id="shop-email" defaultValue="info@vintagestyle.com" />
                  </div>
                  <div>
                    <Label htmlFor="shop-phone">Phone Number</Label>
                    <Input id="shop-phone" defaultValue="+213 555 123 456" />
                  </div>
                  <Button className="bg-black text-white">Save Changes</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment & Shipping</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shipping-cost">Shipping Cost (د.ج)</Label>
                    <Input id="shipping-cost" type="number" defaultValue="500" />
                  </div>
                  <div>
                    <Label htmlFor="free-shipping">Free Shipping Threshold (د.ج)</Label>
                    <Input id="free-shipping" type="number" defaultValue="10000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Methods</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span>Credit Card</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span>PayPal</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span>Bank Transfer</span>
                      </label>
                    </div>
                  </div>
                  <Button className="bg-black text-white">Save Changes</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
