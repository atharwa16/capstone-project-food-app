import { Link } from 'react-router-dom';
import { Heart, Star, Clock, MapPin } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { restaurants, menuItems } from '@/data/restaurants';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { EmptyState, Button } from '@/components/ui';

export function FavoritesPage() {
  const { user } = useAuth();
  const { favoriteRestaurants, favoriteDishes, toggleRestaurant, toggleDish } = useFavorites();

  const favRestaurants = restaurants.filter(r => favoriteRestaurants.includes(r.id));
  const favDishes = menuItems.filter(m => favoriteDishes.includes(m.id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Favorites</h1>

      {/* Restaurants */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Heart size={18} className="text-red-500 fill-red-500" />
          Saved Restaurants ({favRestaurants.length})
        </h2>
        {favRestaurants.length === 0 ? (
          <EmptyState
            icon={<Heart size={48} />}
            title="No favorite restaurants"
            description="Heart the restaurants you love to save them here for quick access."
            action={<Link to="/restaurants"><Button variant="outline">Explore Restaurants</Button></Link>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        )}
      </div>

      {/* Dishes */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Heart size={18} className="text-red-500 fill-red-500" />
          Saved Dishes ({favDishes.length})
        </h2>
        {favDishes.length === 0 ? (
          <EmptyState
            icon={<Heart size={48} />}
            title="No favorite dishes"
            description="Save your favorite dishes while browsing restaurant menus."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favDishes.map(dish => {
              const restaurant = restaurants.find(r => r.id === dish.restaurantId);
              return (
                <Link key={dish.id} to={`/restaurant/${dish.restaurantId}`} className="block bg-white rounded-xl border border-gray-100 p-3 hover:shadow-card transition-shadow">
                  <div className="flex gap-3">
                    <img src={dish.image} alt={dish.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{dish.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{restaurant?.name}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">₹{dish.price}</p>
                    </div>
                    <button
                      onClick={e => { e.preventDefault(); toggleDish(dish.id); }}
                      className="text-red-500 flex-shrink-0 self-start mt-1"
                      aria-label={`Remove ${dish.name} from favorites`}
                    >
                      <Heart size={15} fill="currentColor" />
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
