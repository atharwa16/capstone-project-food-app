import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Package, Heart, RotateCcw, LogOut, Edit2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useRefunds } from '@/contexts/RefundsContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Button } from '@/components/ui/Button';

export function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { orders } = useOrders();
  const { getUserRefunds } = useRefunds();
  const { favoriteRestaurants } = useFavorites();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: user?.name ?? '', phone: user?.phone ?? '' });

  if (!user) return null;

  const userRefunds = getUserRefunds(user.id);
  const totalSpent = orders.filter(o => o.status === 'DELIVERED').reduce((sum, o) => sum + o.total, 0);

  const handleSave = () => {
    updateUser(editForm);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Profile Card */}
        <div className="space-y-4">
          {/* Avatar + Name */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-card">
            <div className="relative inline-block mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-elevated"
              />
              {user.role === 'ADMIN' && (
                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">ADMIN</span>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2 mb-3">
                <input
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full text-center font-bold text-gray-900 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  value={editForm.phone}
                  onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full text-center text-gray-600 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <div className="flex gap-2">
                  <Button size="sm" fullWidth onClick={handleSave}>Save</Button>
                  <Button size="sm" variant="ghost" fullWidth onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-bold text-gray-900 text-lg">{user.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
                <p className="text-sm text-gray-500">{user.phone}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:underline mx-auto font-medium"
                >
                  <Edit2 size={12} /> Edit Profile
                </button>
              </>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="font-bold text-gray-900">{orders.length}</p>
                <p className="text-[10px] text-gray-500">Orders</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">{favoriteRestaurants.length}</p>
                <p className="text-[10px] text-gray-500">Favorites</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
                <p className="text-[10px] text-gray-500">Spent</p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
            {[
              { to: '/orders', icon: Package, label: 'My Orders', count: orders.length },
              { to: '/favorites', icon: Heart, label: 'Favorites', count: favoriteRestaurants.length },
              { to: '/refunds', icon: RotateCcw, label: 'Refunds', count: userRefunds.length },
            ].map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">{item.count}</span>
                </Link>
              );
            })}
          </div>

          <Button variant="danger" fullWidth onClick={handleLogout} leftIcon={<LogOut size={16} />}>
            Sign Out
          </Button>
        </div>

        {/* Right - Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-card">
            <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Full Name</p>
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-800">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-800">{user.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Saved Addresses</h3>
              <button className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                <Plus size={12} /> Add New
              </button>
            </div>
            {user.addresses.length === 0 ? (
              <p className="text-sm text-gray-500">No addresses saved yet.</p>
            ) : (
              <div className="space-y-3">
                {user.addresses.map(addr => (
                  <div key={addr.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{addr.label}</p>
                        {addr.isDefault && <span className="text-[10px] bg-green-100 text-green-700 font-semibold px-1.5 py-0.5 rounded-full">Default</span>}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                    <button className="text-xs text-primary hover:underline font-medium flex-shrink-0">Edit</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Recent Orders</h3>
              <Link to="/orders" className="text-xs text-primary font-medium hover:underline">View All</Link>
            </div>
            {orders.slice(0, 3).length === 0 ? (
              <p className="text-sm text-gray-500">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{order.restaurantName}</p>
                      <p className="text-xs text-gray-500">#{order.id} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">₹{order.total}</p>
                      <p className={`text-xs font-medium ${order.status === 'DELIVERED' ? 'text-green-600' : order.status === 'CANCELLED' ? 'text-red-500' : 'text-amber-600'}`}>
                        {order.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
