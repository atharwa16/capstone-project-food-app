import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, Tag, Heart, Share2, Plus, Minus, ShoppingCart, Search, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import { restaurants, menuItems, reviews } from '@/data/restaurants';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { EmptyState, Modal } from '@/components/ui';
import type { MenuItem } from '@/types';

type Tab = 'menu' | 'reviews' | 'about';

export function RestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { addItem, items, updateQuantity, getQuantity, restaurantId: cartRestId, subtotal, deliveryFee, tax, total, itemCount, clearCart } = useCart();
  const { isRestaurantFav, toggleRestaurant } = useFavorites();

  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [conflictItem, setConflictItem] = useState<{ item: MenuItem; restId: string; restName: string } | null>(null);

  const restaurant = restaurants.find(r => r.id === id);
  const restMenuItems = menuItems.filter(m => m.restaurantId === id);
  const restReviews = reviews.filter(r => r.restaurantId === id);
  const isFav = restaurant ? isRestaurantFav(restaurant.id) : false;

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Restaurant not found.</p>
        <Link to="/" className="text-red-600 hover:underline mt-2 inline-block font-bold">Back to Home</Link>
      </div>
    );
  }

  const categories = restaurant.categories;
  const filteredItems = restMenuItems.filter(item => {
    const matchesCategory = !activeCategory || item.category === activeCategory;
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const itemsByCategory = useMemo(() => {
    const result: Record<string, MenuItem[]> = {};
    for (const cat of categories) {
      const catItems = filteredItems.filter(m => m.category === cat);
      if (catItems.length > 0) result[cat] = catItems;
    }
    return result;
  }, [filteredItems, categories]);

  const handleAddToCart = (item: MenuItem) => {
    const result = addItem(item, restaurant.id, restaurant.name);
    if (result === 'conflict') {
      setConflictItem({ item, restId: restaurant.id, restName: restaurant.name });
    } else {
      toast.success(`${item.name} added to cart! 🍽️`);
    }
  };

  const handleClearAndAdd = () => {
    if (!conflictItem) return;
    clearCart();
    addItem(conflictItem.item, conflictItem.restId, conflictItem.restName);
    toast.success(`Cart updated. ${conflictItem.item.name} added!`);
    setConflictItem(null);
  };

  const hasCartItems = itemCount > 0;

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Cover Image Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-slate-900">
        <img src={restaurant.coverImage} alt={`${restaurant.name} cover`} className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden="true" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 rounded-full px-4 py-2 text-xs font-bold hover:bg-white transition-all shadow-md flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Floating Restaurant Info Card */}
        <div className="bg-white rounded-3xl shadow-xl -mt-16 relative z-10 p-6 mb-8 border border-gray-100/80">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <img src={restaurant.logo} alt={`${restaurant.name} logo`} className="w-20 h-20 rounded-2xl object-cover border border-gray-200 shadow-md flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{restaurant.name}</h1>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">{restaurant.cuisines.join(' • ')}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => { toggleRestaurant(restaurant.id); toast[isFav ? 'info' : 'success'](isFav ? 'Removed from favorites' : 'Added to favorites!'); }}
                    className={clsx('p-2.5 rounded-full border transition-all shadow-xs', isFav ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500')}
                    aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    aria-pressed={isFav}
                  >
                    <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => { navigator.share?.({ title: restaurant.name, url: window.location.href }); toast.info('Link copied to clipboard!'); }}
                    className="p-2.5 rounded-full border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-slate-900 transition-all shadow-xs"
                    aria-label="Share restaurant"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {/* Badges & Rating */}
              <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 bg-emerald-700 text-white px-2.5 py-1 rounded-lg shadow-xs">
                  <span>{restaurant.rating}</span>
                  <Star size={12} className="fill-white" />
                  <span className="font-semibold text-[10px] text-white/90">({restaurant.reviewCount.toLocaleString()}+ ratings)</span>
                </span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-amber-500" />{restaurant.deliveryTime} mins delivery</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" />{restaurant.distance}</span>
                <span className="font-extrabold text-slate-900">₹{restaurant.priceForTwo} for two</span>
              </div>
            </div>
          </div>

          {/* Offers Ribbon */}
          {restaurant.offers.length > 0 && (
            <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100 overflow-x-auto scrollbar-hide">
              {restaurant.offers.map(offer => (
                <div key={offer.id} className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-amber-50 border border-red-200/70 rounded-xl px-3.5 py-2 flex-shrink-0">
                  <Tag size={14} className="text-red-600" />
                  <div>
                    <p className="text-xs font-black text-red-600">{offer.label}</p>
                    <p className="text-[10px] font-semibold text-slate-600">{offer.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tab Header Navigation */}
        <div className="flex border-b border-gray-200 mb-6 bg-white sticky top-16 z-20 rounded-xl p-1 shadow-xs border border-gray-100">
          {(['menu', 'reviews', 'about'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx('flex-1 px-6 py-3 text-xs sm:text-sm font-extrabold capitalize transition-all rounded-xl',
                activeTab === tab ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-gray-50'
              )}
            >
              {tab} {tab === 'menu' && `(${restMenuItems.length})`}
              {tab === 'reviews' && `(${restReviews.length})`}
            </button>
          ))}
        </div>

        {/* Content Layout */}
        <div className="flex gap-8 pb-12">
          {/* Main Dish List Column */}
          <div className="flex-1 min-w-0">
            {activeTab === 'menu' && (
              <MenuTab
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                itemsByCategory={itemsByCategory}
                getQuantity={getQuantity}
                handleAddToCart={handleAddToCart}
                updateQuantity={updateQuantity}
              />
            )}
            {activeTab === 'reviews' && <ReviewsTab reviews={restReviews} restaurant={restaurant} />}
            {activeTab === 'about' && <AboutTab restaurant={restaurant} />}
          </div>

          {/* Desktop Right Cart Sidebar */}
          {hasCartItems && cartRestId === restaurant.id && (
            <div className="hidden lg:block w-88 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-slate-900 to-zinc-900 text-white">
                  <h3 className="font-extrabold text-base">Your Cart Summary</h3>
                  <p className="text-xs text-white/70 font-medium">{restaurant.name}</p>
                </div>
                <div className="p-5 space-y-4 max-h-72 overflow-y-auto">
                  {items.map(ci => (
                    <div key={ci.menuItem.id} className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 line-clamp-1">{ci.menuItem.name}</p>
                        <p className="text-[10px] font-semibold text-slate-400">₹{ci.menuItem.price} each</p>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button onClick={() => updateQuantity(ci.menuItem.id, ci.quantity - 1)} className="w-6 h-6 rounded-md bg-white text-slate-900 shadow-xs flex items-center justify-center font-bold">
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-extrabold w-4 text-center">{ci.quantity}</span>
                        <button onClick={() => updateQuantity(ci.menuItem.id, ci.quantity + 1)} className="w-6 h-6 rounded-md bg-red-600 text-white shadow-xs flex items-center justify-center font-bold">
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-xs font-black text-slate-900 w-16 text-right">₹{ci.menuItem.price * ci.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="p-5 border-t border-gray-100 space-y-2 bg-gray-50/60 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between"><span>Item Total</span><span>₹{subtotal}</span></div>
                  <div className="flex justify-between"><span>Delivery Charge</span><span>{deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${deliveryFee}`}</span></div>
                  <div className="flex justify-between"><span>Taxes & Fees</span><span>₹{tax}</span></div>
                  <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-gray-200"><span>To Pay</span><span>₹{total}</span></div>
                </div>
                <div className="p-5 pt-0 bg-gray-50/60">
                  <Link to="/checkout">
                    <Button fullWidth size="lg" className="rounded-2xl font-black bg-gradient-to-r from-red-600 to-rose-600 shadow-md">
                      Checkout ({itemCount} items)
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Sticky Cart */}
      {hasCartItems && cartRestId === restaurant.id && (
        <div className="fixed bottom-16 md:bottom-4 left-4 right-4 z-30 lg:hidden">
          <Link to="/checkout">
            <Button fullWidth size="lg" className="rounded-2xl font-black bg-gradient-to-r from-red-600 to-rose-600 shadow-2xl py-4 flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} />
                <span>{itemCount} ITEM{itemCount > 1 ? 'S' : ''}</span>
              </div>
              <span>VIEW CART · ₹{total} →</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Conflict Modal */}
      <Modal isOpen={!!conflictItem} onClose={() => setConflictItem(null)} title="Replace cart items?" size="sm">
        <div className="p-5 space-y-4">
          <p className="text-xs font-medium text-slate-600">
            Your cart contains dishes from another kitchen. Food delivery carts can only contain items from a single restaurant at a time.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={() => setConflictItem(null)}>Keep Current</Button>
            <Button fullWidth onClick={handleClearAndAdd} className="bg-red-600">Replace & Add</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function MenuTab({ categories, activeCategory, setActiveCategory, searchQuery, setSearchQuery, itemsByCategory, getQuantity, handleAddToCart, updateQuantity }: {
  categories: string[];
  activeCategory: string | null;
  setActiveCategory: (c: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  itemsByCategory: Record<string, MenuItem[]>;
  getQuantity: (id: string) => number;
  handleAddToCart: (item: MenuItem) => void;
  updateQuantity: (id: string, qty: number) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Menu Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search within this menu..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs"
            aria-label="Search menu items"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={clsx('flex-shrink-0 text-xs font-extrabold px-4 py-2 rounded-xl border transition-all', !activeCategory ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'border-gray-200 bg-white text-slate-700 hover:border-gray-300')}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={clsx('flex-shrink-0 text-xs font-extrabold px-4 py-2 rounded-xl border transition-all whitespace-nowrap', activeCategory === cat ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'border-gray-200 bg-white text-slate-700 hover:border-gray-300')}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {Object.keys(itemsByCategory).length === 0 ? (
        <EmptyState icon={<Search size={40} className="text-gray-300" />} title="No matching dishes" description="Try searching for another dish or reset filters." />
      ) : (
        <div className="space-y-8">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <h3 className="font-black text-slate-900 text-lg tracking-tight">{category}</h3>
                <span className="text-xs font-bold text-slate-400">{items.length} items</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {items.map(item => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    quantity={getQuantity(item.id)}
                    onAdd={() => handleAddToCart(item)}
                    onIncrease={() => updateQuantity(item.id, getQuantity(item.id) + 1)}
                    onDecrease={() => updateQuantity(item.id, getQuantity(item.id) - 1)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MenuItemCard({ item, quantity, onAdd, onIncrease, onDecrease }: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className={clsx('flex items-start justify-between gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-md transition-all', !item.isAvailable && 'opacity-60')}>
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Veg / Non-Veg Indicator */}
        <div className="flex items-center gap-2">
          {item.isVegetarian ? (
            <div className="veg-icon" title="Pure Veg" />
          ) : (
            <div className="non-veg-icon" title="Non-Veg" />
          )}
          {item.isPopular && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
              Bestseller
            </span>
          )}
        </div>

        <h4 className="text-base font-extrabold text-slate-900 line-clamp-1">{item.name}</h4>
        <p className="text-sm font-black text-slate-900">₹{item.price}</p>
        <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
      </div>

      {/* Item Photo + Zomato ADD Button */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        {item.image ? (
          <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 border border-gray-100">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ) : (
          <div className="w-28 h-28 rounded-2xl bg-gray-100 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
            No Image
          </div>
        )}

        <div className="absolute -bottom-2">
          {!item.isAvailable ? (
            <span className="bg-gray-100 text-gray-400 text-[10px] font-bold px-3 py-1 rounded-lg border border-gray-200">
              Sold Out
            </span>
          ) : quantity === 0 ? (
            <button
              onClick={onAdd}
              id={`add-${item.id}`}
              className="bg-white text-emerald-700 border-2 border-emerald-600 hover:bg-emerald-50 text-xs font-black px-6 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1"
            >
              <span>ADD</span>
              <Plus size={12} />
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-700 text-white rounded-xl shadow-md p-1 font-black text-xs">
              <button onClick={onDecrease} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-emerald-800"><Minus size={12} /></button>
              <span className="w-4 text-center">{quantity}</span>
              <button onClick={onIncrease} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-emerald-800"><Plus size={12} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewsTab({ reviews, restaurant }: { reviews: typeof import('@/data/restaurants').reviews; restaurant: typeof import('@/data/restaurants').restaurants[0] }) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
        <div className="text-center p-4 rounded-2xl bg-emerald-50 border border-emerald-100 min-w-[100px]">
          <p className="text-3xl font-black text-emerald-700">{restaurant.rating}</p>
          <div className="flex justify-center text-emerald-600 mt-1"><Star size={14} className="fill-emerald-600" /></div>
          <p className="text-[10px] font-bold text-emerald-800 mt-1">{restaurant.reviewCount} Ratings</p>
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">Customer Feedback & Ratings</h3>
          <p className="text-xs text-slate-500 font-medium">Verified orders from real foodies in Pune.</p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map(rev => (
          <div key={rev.id} className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                <div>
                  <p className="text-xs font-bold text-slate-900">{rev.userName}</p>
                  <p className="text-[10px] text-slate-400">{rev.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                <span>{rev.rating}</span> ★
              </div>
            </div>
            <p className="text-xs font-medium text-slate-700 leading-relaxed">"{rev.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutTab({ restaurant }: { restaurant: typeof import('@/data/restaurants').restaurants[0] }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <div>
        <h3 className="font-black text-slate-900 text-base mb-2">About {restaurant.name}</h3>
        <p className="text-xs font-medium text-slate-600 leading-relaxed">{restaurant.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs font-semibold text-slate-700">
        <div>
          <p className="text-slate-400 font-bold uppercase text-[10px] mb-1">Address</p>
          <p>{restaurant.address}, {restaurant.city}</p>
        </div>
        <div>
          <p className="text-slate-400 font-bold uppercase text-[10px] mb-1">Opening Hours</p>
          <p>{restaurant.openingHours.open} - {restaurant.openingHours.close} ({restaurant.openingHours.days})</p>
        </div>
      </div>
    </div>
  );
}
