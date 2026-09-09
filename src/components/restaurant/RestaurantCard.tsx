import { Star, Clock, MapPin, Heart, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import type { Restaurant } from '@/types';
import { useFavorites } from '@/contexts/FavoritesContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
  className?: string;
}

export function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
  const { isRestaurantFav, toggleRestaurant } = useFavorites();
  const isFav = isRestaurantFav(restaurant.id);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleRestaurant(restaurant.id);
  };

  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className={clsx('block group', className)}
      aria-label={`${restaurant.name} - ${restaurant.cuisines.join(', ')} - Rating ${restaurant.rating}`}
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100/90 shadow-card hover:shadow-elevated hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
        
        {/* Cover Image Container */}
        <div className="relative h-52 overflow-hidden bg-slate-900 flex-shrink-0">
          <img
            src={restaurant.coverImage}
            alt={`${restaurant.name} cover`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
            loading="lazy"
          />
          
          {/* Subtle Dark Gradient Overlay at Bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" aria-hidden="true" />

          {/* Currently Closed Overlay */}
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-white text-slate-900 text-xs font-black px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider">Currently Closed</span>
            </div>
          )}

          {/* Top Left: Offer Badge Overlay (Zomato-style ribbon) */}
          {restaurant.offers.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
              <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-lg shadow-md flex items-center gap-1.5 tracking-wider border border-white/20">
                <Tag size={11} aria-hidden="true" />
                {restaurant.offers[0].label}
              </span>
            </div>
          )}

          {/* Top Right: Favorite Button */}
          <button
            onClick={handleFav}
            className={clsx(
              'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-md z-10 border border-white/30',
              isFav ? 'bg-red-600 text-white scale-110' : 'bg-white/80 text-slate-700 hover:bg-white hover:scale-105',
            )}
            aria-label={isFav ? `Remove ${restaurant.name} from favorites` : `Add ${restaurant.name} to favorites`}
            aria-pressed={isFav}
          >
            <Heart size={16} fill={isFav ? 'currentColor' : 'none'} className={isFav ? 'animate-pulse' : ''} />
          </button>

          {/* Bottom Overlay Info: Delivery Time & Price */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 text-white">
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 border border-white/10">
              <Clock size={11} className="text-amber-400" />
              {restaurant.deliveryTime} mins
            </span>
            {restaurant.isVegetarian && (
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                PURE VEG
              </span>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
          <div>
            {/* Title & Solid Rating Pill */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-extrabold text-slate-900 text-base line-clamp-1 group-hover:text-red-600 transition-colors">
                {restaurant.name}
              </h3>
              <div className="flex items-center gap-1 flex-shrink-0 bg-emerald-700 text-white rounded-lg px-2 py-0.5 shadow-xs">
                <span className="text-xs font-black">{restaurant.rating}</span>
                <Star size={10} className="fill-white" aria-hidden="true" />
              </div>
            </div>

            {/* Cuisines */}
            <p className="text-xs font-semibold text-slate-500 line-clamp-1 mt-0.5">
              {restaurant.cuisines.join(' • ')}
            </p>
          </div>

          {/* Address & Price for Two */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1 font-semibold text-slate-500">
              <MapPin size={12} className="text-slate-400" />
              {restaurant.distance}
            </span>
            <span className="text-slate-900">
              ₹{restaurant.priceForTwo} for two
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function RestaurantCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs">
      <div className="skeleton h-52 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="skeleton h-5 w-36 rounded-md" />
          <div className="skeleton h-5 w-12 rounded-md" />
        </div>
        <div className="skeleton h-3.5 w-24 rounded" />
        <div className="skeleton h-4 w-full rounded pt-2" />
      </div>
    </div>
  );
}
