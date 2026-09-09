import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, MapPin, ChevronDown, User, LogOut, Package, Heart, UtensilsCrossed, Menu, X, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';

const LOCATIONS = ['Pune', 'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai'];

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Pune');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) setShowLocationPicker(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 h-16">
          
          {/* Left section: Logo + Location */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
                <UtensilsCrossed size={18} className="text-white" />
              </div>
              <span className="font-extrabold text-gray-900 text-xl tracking-tight">
                Bite<span className="text-red-500">Hub</span>
              </span>
            </Link>

            {!isAdminPage && (
              <div className="relative" ref={locationRef}>
                <button
                  id="location-selector"
                  onClick={() => setShowLocationPicker(v => !v)}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-red-500 transition-colors bg-gray-100/80 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200/60"
                  aria-expanded={showLocationPicker}
                  aria-haspopup="listbox"
                >
                  <MapPin size={14} className="text-red-500" aria-hidden="true" />
                  <span className="max-w-[100px] truncate">{selectedCity}</span>
                  <ChevronDown size={13} className={clsx('transition-transform text-gray-400', showLocationPicker && 'rotate-180')} />
                </button>
                {showLocationPicker && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1">Select Delivery City</p>
                    {LOCATIONS.map(city => (
                      <button
                        key={city}
                        role="option"
                        aria-selected={city === selectedCity}
                        onClick={() => { setSelectedCity(city); setShowLocationPicker(false); }}
                        className={clsx('w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between', city === selectedCity ? 'text-red-500 font-bold bg-red-50/50' : 'text-gray-700 hover:bg-gray-50')}
                      >
                        <span>{city}</span>
                        {city === selectedCity && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Middle section: Search Bar */}
          {!isAdminPage && (
            <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden md:flex mx-4">
              <div className="relative w-full">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search restaurants, cuisines, or dishes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-inner"
                  aria-label="Search restaurants or dishes"
                />
              </div>
            </form>
          )}

          {/* Right section: Cart, Auth */}
          <div className="flex items-center gap-3">
            {/* Admin Quick Link */}
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all shadow-2xs"
              title="Open BiteHub Admin Console"
            >
              <ShieldAlert size={14} className="text-amber-600" />
              <span>Admin Panel</span>
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              id="cart-btn"
              className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-700 hover:text-red-500 flex items-center justify-center border border-gray-200/50"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-500 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center px-1 shadow-sm">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* User Auth Menu */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  id="user-menu-btn"
                  onClick={() => setShowUserMenu(v => !v)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors border border-gray-200/60"
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                  <ChevronDown size={14} className={clsx('text-gray-500 transition-transform hidden sm:block mr-1', showUserMenu && 'rotate-180')} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors">
                      <ShieldAlert size={15} />
                      {user.role === 'ADMIN' ? 'Admin Panel' : 'Switch to Admin Console'}
                    </Link>
                    <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <User size={15} className="text-gray-400" />Profile Settings
                    </Link>
                    <Link to="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Package size={15} className="text-gray-400" />My Orders
                    </Link>
                    <Link to="/favorites" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Heart size={15} className="text-gray-400" />Favorites
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left font-medium">
                        <LogOut size={15} />Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50">
                  Login
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="rounded-full px-4 shadow-sm bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              onClick={() => setShowMobileMenu(v => !v)}
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Expanded Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-3 border-t border-gray-100 space-y-2 animate-fade-in">
            <form onSubmit={handleSearch} className="mb-2">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search dishes or restaurants..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>
            </form>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/restaurants" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold">
                <UtensilsCrossed size={16} /> Explore All
              </Link>
              <Link to="/orders" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-100 text-gray-800 text-xs font-bold">
                <Package size={16} /> My Orders
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function MobileBottomNav() {
  const location = useLocation();
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { to: '/', icon: Search, label: 'Home' },
    { to: '/restaurants', icon: UtensilsCrossed, label: 'Explore' },
    { to: '/orders', icon: Package, label: 'Orders', protected: true },
    { to: '/favorites', icon: Heart, label: 'Saved', protected: true },
    { to: isAuthenticated ? '/profile' : '/login', icon: User, label: 'Account' },
  ];

  const isHiddenPage = ['/login', '/signup', '/admin'].some(p => location.pathname.startsWith(p));
  if (isHiddenPage) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg" aria-label="Mobile navigation">
      <div className="flex items-center h-16">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={clsx('flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors', isActive ? 'text-red-500 font-bold' : 'text-gray-400 hover:text-gray-600')}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon size={20} aria-hidden="true" />
                {item.label === 'Orders' && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{itemCount}</span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
