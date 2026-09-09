import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { restaurants, menuItems } from '@/data/restaurants';
import { RestaurantCard, RestaurantCardSkeleton } from '@/components/restaurant/RestaurantCard';
import { EmptyState } from '@/components/ui';
import type { RestaurantFilters, SortOption } from '@/types';

const CUISINE_OPTIONS = ['Indian', 'Chinese', 'Italian', 'Fast Food', 'South Indian', 'North Indian', 'Desserts', 'Street Food', 'Mughlai'];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating', label: 'Rating (High to Low)' },
  { value: 'delivery_time', label: 'Delivery Time' },
  { value: 'cost_low', label: 'Cost: Low to High' },
  { value: 'cost_high', label: 'Cost: High to Low' },
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [localQuery, setLocalQuery] = useState(query);
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [sort, setSort] = useState<SortOption>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'dishes'>('restaurants');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(localQuery ? { q: localQuery } : {});
  };

  const filteredRestaurants = useMemo(() => {
    let result = restaurants.filter(r => {
      if (!query) return true;
      const q = query.toLowerCase();
      return r.name.toLowerCase().includes(q) ||
        r.cuisines.some(c => c.toLowerCase().includes(q)) ||
        r.description.toLowerCase().includes(q);
    });

    if (filters.rating) result = result.filter(r => r.rating >= filters.rating!);
    if (filters.maxCost) result = result.filter(r => r.priceForTwo <= filters.maxCost!);
    if (filters.cuisines?.length) result = result.filter(r => r.cuisines.some(c => filters.cuisines!.includes(c)));
    if (filters.dietary?.includes('vegetarian')) result = result.filter(r => r.isVegetarian);
    if (filters.hasOffers) result = result.filter(r => r.offers.length > 0);
    if (filters.freeDelivery) result = result.filter(r => r.deliveryFee === 0);

    switch (sort) {
      case 'rating': result = [...result].sort((a, b) => b.rating - a.rating); break;
      case 'delivery_time': result = [...result].sort((a, b) => a.deliveryTime - b.deliveryTime); break;
      case 'cost_low': result = [...result].sort((a, b) => a.priceForTwo - b.priceForTwo); break;
      case 'cost_high': result = [...result].sort((a, b) => b.priceForTwo - a.priceForTwo); break;
    }
    return result;
  }, [query, filters, sort]);

  const filteredDishes = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return menuItems.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [query]);

  const toggleCuisine = (cuisine: string) => {
    const current = filters.cuisines ?? [];
    setFilters(f => ({ ...f, cuisines: current.includes(cuisine) ? current.filter(c => c !== cuisine) : [...current, cuisine] }));
  };

  const clearFilters = () => setFilters({});
  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && (Array.isArray(v) ? v.length > 0 : true)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search restaurants, cuisines, or dishes..."
            value={localQuery}
            onChange={e => setLocalQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
            aria-label="Search"
          />
        </div>
        <button type="submit" className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors">
          Search
        </button>
      </form>

      {query && (
        <p className="text-sm text-gray-600 mb-4">
          Results for <strong className="text-gray-900">"{query}"</strong>
        </p>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-200">
        <button onClick={() => setActiveTab('restaurants')} className={clsx('px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors', activeTab === 'restaurants' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700')}>
          Restaurants ({filteredRestaurants.length})
        </button>
        {query && (
          <button onClick={() => setActiveTab('dishes')} className={clsx('px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors', activeTab === 'dishes' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700')}>
            Dishes ({filteredDishes.length})
          </button>
        )}
      </div>

      {activeTab === 'restaurants' && (
        <div>
          {/* Sort & Filter controls */}
          <div className="flex items-center gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
            {/* Sort */}
            <div className="relative flex-shrink-0">
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none cursor-pointer"
                aria-label="Sort restaurants"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(v => !v)}
              className={clsx('flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-lg transition-colors flex-shrink-0', activeFilterCount > 0 ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white')}
            >
              <SlidersHorizontal size={14} />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>

            {/* Quick filters */}
            {[
              { label: 'Top Rated (4+)', action: () => setFilters(f => ({ ...f, rating: 4 })) },
              { label: 'Veg Only', action: () => setFilters(f => ({ ...f, dietary: ['vegetarian'] })) },
              { label: 'Offers', action: () => setFilters(f => ({ ...f, hasOffers: true })) },
              { label: 'Under ₹300', action: () => setFilters(f => ({ ...f, maxCost: 300 })) },
            ].map(chip => (
              <button key={chip.label} onClick={chip.action} className="flex-shrink-0 px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:border-primary hover:text-primary bg-white transition-colors whitespace-nowrap">
                {chip.label}
              </button>
            ))}

            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 flex-shrink-0 ml-auto">
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 mb-5 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {/* Rating */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Rating</p>
                  {[4.5, 4.0, 3.5].map(r => (
                    <label key={r} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input type="radio" name="rating" checked={filters.rating === r} onChange={() => setFilters(f => ({ ...f, rating: r }))} className="text-primary" />
                      <span className="text-sm text-gray-700">{r}+ ★</span>
                    </label>
                  ))}
                </div>
                {/* Cost */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Cost for Two</p>
                  {[{ label: 'Under ₹200', max: 200 }, { label: '₹200–₹400', max: 400 }, { label: '₹400–₹600', max: 600 }, { label: '₹600+', max: 99999 }].map(c => (
                    <label key={c.max} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input type="radio" name="cost" checked={filters.maxCost === c.max} onChange={() => setFilters(f => ({ ...f, maxCost: c.max }))} className="text-primary" />
                      <span className="text-sm text-gray-700">{c.label}</span>
                    </label>
                  ))}
                </div>
                {/* Cuisine */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Cuisine</p>
                  {CUISINE_OPTIONS.slice(0, 5).map(c => (
                    <label key={c} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input type="checkbox" checked={filters.cuisines?.includes(c) ?? false} onChange={() => toggleCuisine(c)} className="rounded text-primary" />
                      <span className="text-sm text-gray-700">{c}</span>
                    </label>
                  ))}
                </div>
                {/* Dietary */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Dietary</p>
                  <label className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="checkbox" checked={filters.dietary?.includes('vegetarian') ?? false} onChange={() => setFilters(f => ({ ...f, dietary: f.dietary?.includes('vegetarian') ? [] : ['vegetarian'] }))} className="rounded text-primary" />
                    <span className="text-sm text-gray-700">Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="checkbox" checked={filters.hasOffers ?? false} onChange={e => setFilters(f => ({ ...f, hasOffers: e.target.checked || undefined }))} className="rounded text-primary" />
                    <span className="text-sm text-gray-700">Has Offers</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {filteredRestaurants.length === 0 ? (
            <EmptyState
              icon={<Search size={48} />}
              title="No restaurants found"
              description={query ? `No restaurants match "${query}" with the current filters.` : 'Try adjusting your filters.'}
              action={<button onClick={clearFilters} className="text-sm text-primary hover:underline font-medium">Clear filters</button>}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>
          )}
        </div>
      )}

      {activeTab === 'dishes' && (
        <div>
          {filteredDishes.length === 0 ? (
            <EmptyState icon={<Search size={48} />} title="No dishes found" description={`No dishes match "${query}"`} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDishes.map(dish => {
                const restaurant = restaurants.find(r => r.id === dish.restaurantId);
                return (
                  <Link
                    key={dish.id}
                    to={`/restaurant/${dish.restaurantId}`}
                    className="flex gap-3 bg-white rounded-xl border border-gray-100 p-3 hover:shadow-card transition-shadow"
                  >
                    <img src={dish.image} alt={dish.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{dish.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{restaurant?.name}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">₹{dish.price}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function RestaurantsPage() {
  return <SearchPage />;
}
