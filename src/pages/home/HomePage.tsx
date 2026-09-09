import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, Star, Clock, ChevronRight, Zap, Flame, Award, HeartHandshake, UtensilsCrossed, Percent, Gift, Sparkles, MapPin } from 'lucide-react';
import { restaurants } from '@/data/restaurants';
import { RestaurantCard, RestaurantCardSkeleton } from '@/components/restaurant/RestaurantCard';
import { Button } from '@/components/ui/Button';

const CATEGORIES = [
  { name: 'Pizza', emoji: '🍕', query: 'pizza', color: 'bg-rose-50 text-rose-600 border-rose-100', itemsCount: '45+ places' },
  { name: 'Burger', emoji: '🍔', query: 'burger', color: 'bg-amber-50 text-amber-600 border-amber-100', itemsCount: '30+ places' },
  { name: 'Biryani', emoji: '🍛', query: 'biryani', color: 'bg-yellow-50 text-yellow-700 border-yellow-100', itemsCount: '60+ places' },
  { name: 'Chinese', emoji: '🥡', query: 'chinese', color: 'bg-red-50 text-red-600 border-red-100', itemsCount: '25+ places' },
  { name: 'South Indian', emoji: '🫓', query: 'south indian', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', itemsCount: '40+ places' },
  { name: 'North Indian', emoji: '🍲', query: 'north indian', color: 'bg-orange-50 text-orange-600 border-orange-100', itemsCount: '50+ places' },
  { name: 'Desserts', emoji: '🍰', query: 'desserts', color: 'bg-pink-50 text-pink-600 border-pink-100', itemsCount: '35+ places' },
  { name: 'Healthy', emoji: '🥗', query: 'healthy', color: 'bg-teal-50 text-teal-600 border-teal-100', itemsCount: '20+ places' },
  { name: 'Rolls', emoji: '🌯', query: 'rolls', color: 'bg-amber-50 text-amber-700 border-amber-100', itemsCount: '28+ places' },
  { name: 'Beverages', emoji: '🥤', query: 'beverages', color: 'bg-cyan-50 text-cyan-600 border-cyan-100', itemsCount: '15+ places' },
];

const OFFERS = [
  {
    id: 1,
    title: 'FLAT 50% OFF',
    subtitle: 'On your first 3 food orders',
    code: 'WELCOME50',
    bg: 'from-rose-600 to-red-700',
    icon: Percent,
  },
  {
    id: 2,
    title: 'FREE DELIVERY',
    subtitle: 'On orders above ₹199 from top spots',
    code: 'FREEDEL',
    bg: 'from-amber-600 to-orange-600',
    icon: Zap,
  },
  {
    id: 3,
    title: 'BOGO FEAST',
    subtitle: 'Buy 1 Get 1 Free on gourmet burgers & pizzas',
    code: 'BOGOPARTY',
    bg: 'from-slate-900 to-zinc-900',
    icon: Gift,
  },
];

const STATS = [
  { label: 'Top Rated Kitchens', value: '10+', icon: Flame, color: 'text-rose-600 bg-rose-50' },
  { label: 'Delivered Orders', value: '50,000+', icon: HeartHandshake, color: 'text-amber-600 bg-amber-50' },
  { label: 'Authentic Cuisines', value: '120+', icon: Award, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Average Express Delivery', value: '25 mins', icon: Zap, color: 'text-blue-600 bg-blue-50' },
];

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);
  const navigate = useNavigate();

  const topRated = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const fastDelivery = [...restaurants].sort((a, b) => a.deliveryTime - b.deliveryTime).slice(0, 4);
  const recommended = restaurants.slice(0, 4);
  const budget = [...restaurants].sort((a, b) => a.priceForTwo - b.priceForTwo).slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Zomato-Style Visual Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-16 md:py-24">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop"
            alt="Food background"
            className="w-full h-full object-cover scale-105 filter blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-amber-300 shadow-inner">
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              <span>India's Favorite Food Delivery Destination</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Delicious Food, Delivered{' '}
              <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                To Your Doorstep
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Explore 100+ top-rated restaurants, authentic street food, & legendary bakeries near Pune.
            </p>

            {/* Giant Hero Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto pt-2">
              <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2 border border-white/20">
                <Search size={22} className="ml-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search for restaurants, cuisines, or a favorite dish..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-4 py-3.5 rounded-xl text-gray-900 placeholder:text-gray-400 text-sm sm:text-base font-medium focus:outline-none bg-transparent"
                  aria-label="Search restaurants, cuisines, or dishes"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm px-7 py-3.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span>Search</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>

            {/* Trending Quick Search Chips */}
            <div className="flex items-center justify-center flex-wrap gap-2 pt-2 text-xs">
              <span className="text-slate-400 font-bold">Trending Searches:</span>
              {['Chicken Biryani', 'Margherita Pizza', 'Butter Naan', 'Crispy Dosa', 'Cheesy Burgers', 'Chocolate Cake'].map(q => (
                <button
                  key={q}
                  onClick={() => navigate(`/search?q=${q}`)}
                  className="text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all font-semibold hover:scale-105"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top Discount Offers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {OFFERS.map(offer => {
            const Icon = offer.icon;
            return (
              <div
                key={offer.id}
                className={`bg-gradient-to-r ${offer.bg} text-white p-5 rounded-2xl shadow-xl flex items-center justify-between border border-white/20 hover:scale-[1.02] transition-transform cursor-pointer group`}
                onClick={() => navigate('/restaurants')}
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-[11px] font-extrabold tracking-wider">
                    <Icon size={12} />
                    <span>USE CODE: {offer.code}</span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight">{offer.title}</h3>
                  <p className="text-xs text-white/80 font-medium">{offer.subtitle}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">

        {/* Categories Carousel */}
        <section aria-label="Food categories">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-black text-red-600 uppercase tracking-widest">Inspiration for your first order</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">What's on your mind?</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => navigate(`/search?q=${encodeURIComponent(cat.query)}`)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-gray-100 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-center"
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.color} border flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                  {cat.emoji}
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition-colors line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {cat.itemsCount}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Platform Telemetry Bar */}
        <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(stat => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center flex-shrink-0 shadow-xs`}>
                    <IconComponent size={22} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recommended Restaurants Section */}
        <RestaurantSection
          title="Recommended For You"
          subtitle="Top rated partners based on popularity and fast fulfillment"
          restaurants={recommended}
          isLoading={isLoading}
          icon={<Star size={22} className="text-amber-500 fill-amber-400" />}
        />

        {/* Super Fast Delivery Section */}
        <RestaurantSection
          title="Express 30-Min Delivery"
          subtitle="Hot piping meals delivered straight to your doorstep"
          restaurants={fastDelivery}
          isLoading={isLoading}
          icon={<Zap size={22} className="text-red-600 fill-red-600" />}
        />

        {/* Top Rated Spots */}
        <RestaurantSection
          title="Top Customer Rated Spots"
          subtitle="Highest customer reviewed dining choices in Pune"
          restaurants={topRated}
          isLoading={isLoading}
          icon={<Award size={22} className="text-emerald-600" />}
        />

        {/* Budget Friendly Section */}
        <RestaurantSection
          title="Pocket Friendly Delights"
          subtitle="Budget meals under ₹300 for two with great taste"
          restaurants={budget}
          isLoading={isLoading}
          icon={<Clock size={22} className="text-blue-600" />}
        />

        {/* View All Call to Action */}
        <div className="text-center pt-6 pb-6">
          <Link to="/restaurants">
            <Button variant="outline" size="lg" className="rounded-2xl border-2 px-10 py-4 font-black border-slate-300 hover:border-red-600 text-slate-800 hover:text-red-600 text-base shadow-sm" rightIcon={<ChevronRight size={20} />}>
              Explore All 100+ Restaurants
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, icon, action }: { title: string; subtitle?: string; icon?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <div className="flex items-center gap-2.5">
          {icon}
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
        </div>
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1 font-semibold">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function RestaurantSection({ title, subtitle, restaurants, isLoading, icon }: {
  title: string;
  subtitle?: string;
  restaurants: typeof import('@/data/restaurants').restaurants;
  isLoading: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <section aria-label={title}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        action={
          <Link to="/restaurants" className="text-xs sm:text-sm font-extrabold text-red-600 hover:text-red-700 flex items-center gap-1 group">
            <span>See all</span>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
        {isLoading
          ? Array(4).fill(0).map((_, i) => <RestaurantCardSkeleton key={i} />)
          : restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)
        }
      </div>
    </section>
  );
}
