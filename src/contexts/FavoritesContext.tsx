import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface FavoritesContextValue {
  favoriteRestaurants: string[];
  favoriteDishes: string[];
  toggleRestaurant: (id: string) => void;
  toggleDish: (id: string) => void;
  isRestaurantFav: (id: string) => boolean;
  isDishFav: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();
  const [localRestFavs, setLocalRestFavs] = useState<string[]>([]);
  const [localDishFavs, setLocalDishFavs] = useState<string[]>([]);

  const favoriteRestaurants = user?.favoriteRestaurants ?? localRestFavs;
  const favoriteDishes = user?.favoriteDishes ?? localDishFavs;

  const toggleRestaurant = useCallback((id: string) => {
    const current = user?.favoriteRestaurants ?? localRestFavs;
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    if (user) updateUser({ favoriteRestaurants: next });
    else setLocalRestFavs(next);
  }, [user, localRestFavs, updateUser]);

  const toggleDish = useCallback((id: string) => {
    const current = user?.favoriteDishes ?? localDishFavs;
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    if (user) updateUser({ favoriteDishes: next });
    else setLocalDishFavs(next);
  }, [user, localDishFavs, updateUser]);

  const isRestaurantFav = useCallback((id: string) => favoriteRestaurants.includes(id), [favoriteRestaurants]);
  const isDishFav = useCallback((id: string) => favoriteDishes.includes(id), [favoriteDishes]);

  return (
    <FavoritesContext.Provider value={{ favoriteRestaurants, favoriteDishes, toggleRestaurant, toggleDish, isRestaurantFav, isDishFav }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
