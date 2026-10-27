import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, Search, Shield, Package, DollarSign, Check } from 'lucide-react';

const INITIAL_PRODUCTS = [
  { id: 'p1', title: 'Noise-Canceling Wireless Headphones', category: 'Electronics', price: 249.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', stock: 15, sales: 120, description: 'Premium active noise cancellation with 30h battery life.' },
  { id: 'p2', title: 'Minimalist Mechanical Keyboard', category: 'Electronics', price: 129.50, rating: 4.6, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80', stock: 8, sales: 85, description: 'Hot-swappable tactile switches with RGB backlighting.' },
  { id: 'p3', title: 'Ergonomic Leather Desk Chair', category: 'Furniture', price: 349.00, rating: 4.9, image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=500&q=80', stock: 4, sales: 42, description: 'Lumbar support executive chair with memory foam.' },
  { id: 'p4', title: 'Stainless Steel Smart Watch', category: 'Electronics', price: 199.99, rating: 4.4, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', stock: 22, sales: 210, description: 'Fitness tracking, heart rate monitor, AMOLED display.' }
];

export default function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ecom_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    localStorage.setItem('ecom_products', JSON.stringify(products));
  }, [products]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalCart = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newOrder = {
      id: 'ORD-' + Date.now(),
      items: [...cart],
      total: totalCart,
      date: new Date().toLocaleDateString()
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCartOpen(false);
    alert('Order placed successfully! Order ID: ' + newOrder.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-slate-800 gap-4">
        <h1 className="text-2xl font-bold text-indigo-400 flex items-center gap-2">🛒 TechStore E-Commerce</h1>
        <div className="flex gap-4 items-center">
          <button onClick={() => setIsAdmin(!isAdmin)} className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 border border-slate-700">
            <Shield className="w-4 h-4 text-amber-400" /> {isAdmin ? 'Customer View' : 'Admin Panel'}
          </button>
          <button onClick={() => setIsCartOpen(true)} className="relative px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold flex items-center gap-2 shadow">
            <ShoppingCart className="w-4 h-4" /> Cart ({cart.reduce((a, b) => a + b.qty, 0)})
          </button>
        </div>
      </header>

      {isAdmin ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Admin Inventory Control</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-slate-400 uppercase">
                <tr><th className="p-3">Title</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="p-3 font-semibold">{p.title}</td>
                    <td className="p-3 text-slate-400">{p.category}</td>
                    <td className="p-3 text-emerald-400 font-bold">${p.price}</td>
                    <td className="p-3">{p.stock} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6 flex gap-3">
            <div className="flex-1 flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input type="text" placeholder="Search catalog..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent outline-none w-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.filter(p => p.title.toLowerCase().includes(search.toLowerCase())).map(p => (
              <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4 flex flex-col justify-between">
                <img src={p.image} className="w-full h-40 object-cover rounded-xl mb-3" alt={p.title} />
                <div>
                  <h3 className="font-bold text-sm mb-1">{p.title}</h3>
                  <p className="text-xs text-slate-400 mb-3">{p.description}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-emerald-400 font-extrabold text-sm">${p.price}</span>
                  <button onClick={() => addToCart(p)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold">
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-end z-50">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
                <h3 className="font-bold text-lg">Your Shopping Cart</h3>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              {cart.length === 0 ? <p className="text-xs text-slate-400">Your cart is empty.</p> : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl text-xs">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-slate-400">Qty: {item.qty} x ${item.price}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-slate-800">
              <div className="flex justify-between font-bold text-sm mb-4">
                <span>Total:</span>
                <span className="text-emerald-400">${totalCart.toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-xs">
                Checkout Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
