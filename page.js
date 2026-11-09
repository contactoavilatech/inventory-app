'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Package, ShoppingCart, ShieldAlert, Barcode, TrendingUp, 
  Users, CheckCircle2, Trash2, Plus, Search, Sun, Moon, Lock 
} from 'lucide-react';

export default function EnterpriseInventoryApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState('ADMIN'); // ADMIN, MANAGER, OPERATOR, VIEWER
  const [darkMode, setDarkMode] = useState(true);
  
  // Mock State for demonstration & live Supabase sync
  const [ingredients, setIngredients] = useState([
    { id: '1', name: 'Flour (Type 00)', sku: 'ING-FLOUR-01', current_stock: 45.00, unit: 'kg', min_threshold: 10.00 },
    { id: '2', name: 'Mozzarella Cheese', sku: 'ING-CHEESE-02', current_stock: 8.50, unit: 'kg', min_threshold: 10.00 },
    { id: '3', name: 'San Marzano Tomatoes', sku: 'ING-TOM-03', current_stock: 60.00, unit: 'cans', min_threshold: 15.00 }
  ]);

  const [products, setProducts] = useState([
    { id: 'p1', name: 'Artisan Margherita Pizza', barcode: '750103130110', current_stock: 14, sale_price: 12.50 },
    { id: 'p2', name: 'Pepperoni Supreme Pizza', barcode: '750103130127', current_stock: 3, sale_price: 15.00 }
  ]);

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Toggle Dark Mode class on root html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? {...item, qty: item.qty + 1} : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.sale_price * item.qty), 0);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Navbar */}
      <header className={`border-b px-6 py-4 flex items-center justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 text-white rounded-xl font-bold">AV</div>
          <div>
            <h1 className="font-bold text-lg leading-none">AvilaTech ERP</h1>
            <span className="text-xs text-slate-400">Inventory, Barcode POS & Operations</span>
          </div>
        </div>

        {/* Role Switcher & Theme Control */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Profile:</span>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="bg-slate-700 text-white rounded px-2 py-0.5 font-semibold focus:outline-none"
            >
              <option value="ADMIN">ADMIN (Full Access)</option>
              <option value="MANAGER">MANAGER (Approvals)</option>
              <option value="OPERATOR">OPERATOR (Input Only)</option>
              <option value="VIEWER">VIEWER (Read Only)</option>
            </select>
          </div>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <nav className={`flex space-x-2 px-6 py-2 border-b ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
          { id: 'inventory', label: 'Inventory (Ingredients & Products)', icon: Package },
          { id: 'pos', label: 'Point of Sale (POS)', icon: ShoppingCart },
          { id: 'approvals', label: 'Approval Queue', icon: CheckCircle2 },
          { id: 'audit', label: 'Audit Logs', icon: Barcode },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Executive Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <p className="text-sm text-slate-400">Total Ingredients</p>
                <p className="text-3xl font-extrabold mt-1">{ingredients.length}</p>
              </div>
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <p className="text-sm text-slate-400">Finished Products</p>
                <p className="text-3xl font-extrabold mt-1">{products.length}</p>
              </div>
              <div className={`p-5 rounded-2xl border border-red-500/30 ${darkMode ? 'bg-red-950/20' : 'bg-red-50'}`}>
                <p className="text-sm text-red-500 font-semibold">Low Stock Alerts</p>
                <p className="text-3xl font-extrabold text-red-600 mt-1">
                  {ingredients.filter(i => i.current_stock < i.min_threshold).length}
                </p>
              </div>
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <p className="text-sm text-slate-400">Active Profile Role</p>
                <p className="text-xl font-bold text-blue-500 mt-1">{role}</p>
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Inventory Management</h2>
              {role !== 'VIEWER' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 text-sm font-semibold">
                  <Plus className="w-4 h-4" />
                  <span>Add New Item</span>
                </button>
              )}
            </div>

            <div className={`border rounded-2xl p-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-bold mb-4">Raw Ingredients Stock</h3>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">SKU Code</th>
                    <th className="pb-3">Stock Level</th>
                    <th className="pb-3">Status</th>
                    {role === 'ADMIN' && <th className="pb-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((item) => (
                    <tr key={item.id} className={`border-b ${darkMode ? 'border-slate-800/60' : 'border-slate-100'}`}>
                      <td className="py-3 font-medium">{item.name}</td>
                      <td className="py-3 font-mono text-slate-400">{item.sku}</td>
                      <td className="py-3 font-bold">{item.current_stock} {item.unit}</td>
                      <td className="py-3">
                        {item.current_stock < item.min_threshold ? (
                          <span className="px-2.5 py-1 bg-red-500/10 text-red-500 text-xs rounded-full font-semibold">Low Stock</span>
                        ) : (
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-xs rounded-full font-semibold">Optimal</span>
                        )}
                      </td>
                      {role === 'ADMIN' && (
                        <td className="py-3 text-right">
                          <button 
                            onClick={() => alert(`Admin Action: Delete ${item.name}`)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                            title="Delete Item (Admin Only)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* POS TAB */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold">Point of Sale & Invoicing</h2>
              <div className="grid grid-cols-2 gap-4">
                {products.map((prod) => (
                  <div 
                    key={prod.id} 
                    onClick={() => addToCart(prod)}
                    className={`p-4 rounded-xl border cursor-pointer hover:border-blue-500 transition ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
                  >
                    <p className="font-bold">{prod.name}</p>
                    <p className="text-xs text-slate-400 font-mono mt-1">Barcode: {prod.barcode}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-blue-500 font-extrabold">${prod.sale_price.toFixed(2)}</span>
                      <span className="text-xs bg-slate-800 px-2 py-1 rounded">Stock: {prod.current_stock}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart & Checkout */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div>
                <h3 className="font-bold text-lg mb-4">Current Order Ticket</h3>
                {cart.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-10">Cart is empty. Click products to add.</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2 border-slate-800">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-slate-400">${item.sale_price} x {item.qty}</p>
                        </div>
                        <p className="font-bold">${(item.sale_price * item.qty).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-800 pt-4 mt-6">
                <div className="flex justify-between font-extrabold text-lg mb-4">
                  <span>Total Due:</span>
                  <span className="text-blue-500">${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  onClick={() => { alert('Order completed successfully! Stock updated.'); setCart([]); }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition shadow-lg"
                >
                  Complete Sale & Print Invoice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* APPROVALS TAB */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Stock Movement & Approval Queue</h2>
            <div className={`p-6 rounded-2xl border text-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-bold text-lg">No Pending Approvals</h3>
              <p className="text-sm text-slate-400 mt-1">All operator stock submissions have been reviewed and approved.</p>
            </div>
          </div>
        )}

        {/* AUDIT LOGS TAB */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Audit Trails & Activity Logs</h2>
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <p className="text-sm text-slate-400">System event logs track all creations, barcode scans, POS sales, and Admin deletions.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}