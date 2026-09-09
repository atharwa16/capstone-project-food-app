import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { OrdersProvider } from '@/contexts/OrdersContext';
import { RefundsProvider } from '@/contexts/RefundsContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { MainLayout, AuthLayout, AdminLayout } from '@/layouts';
import { ProtectedRoute, AdminRoute, GuestRoute } from '@/components/layout/ProtectedRoute';

// Pages
import { HomePage } from '@/pages/home/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { RestaurantPage } from '@/pages/restaurant/RestaurantPage';
import { SearchPage, RestaurantsPage } from '@/pages/search/SearchPage';
import { CartPage } from '@/pages/cart/CartPage';
import { CheckoutPage } from '@/pages/checkout/CheckoutPage';
import { OrderConfirmationPage, OrderTrackingPage } from '@/pages/orders/OrderPages';
import { OrdersPage } from '@/pages/orders/OrdersPage';
import { RefundsPage, RefundDetailPage } from '@/pages/refunds/RefundsPage';
import { FavoritesPage } from '@/pages/favorites/FavoritesPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import {
  AdminDashboard,
  AdminUsers,
  AdminRestaurants,
  AdminOrders,
  AdminRefunds,
  AdminSystemMonitor,
} from '@/pages/admin/AdminPages';

function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h2>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="text-red-500 font-semibold hover:underline">← Back to Home</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <OrdersProvider>
              <RefundsProvider>
                <FavoritesProvider>
                  <Routes>
                    {/* Main layout routes */}
                    <Route element={<MainLayout />}>
                      <Route index element={<HomePage />} />
                      <Route path="/restaurants" element={<RestaurantsPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/restaurant/:id" element={<RestaurantPage />} />
                      <Route path="/cart" element={<CartPage />} />

                      {/* Protected user routes */}
                      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                      <Route path="/order-confirmation/:id" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
                      <Route path="/order-tracking/:id" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
                      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                      <Route path="/refunds" element={<ProtectedRoute><RefundsPage /></ProtectedRoute>} />
                      <Route path="/refunds/:refundId" element={<ProtectedRoute><RefundDetailPage /></ProtectedRoute>} />
                      <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                      <Route path="*" element={<NotFoundPage />} />
                    </Route>

                    {/* Auth routes (guest only) */}
                    <Route element={<AuthLayout />}>
                      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                      <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
                    </Route>

                    {/* Admin routes */}
                    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="system-monitor" element={<AdminSystemMonitor />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="restaurants" element={<AdminRestaurants />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="refunds" element={<AdminRefunds />} />
                    </Route>
                  </Routes>
                </FavoritesProvider>
              </RefundsProvider>
            </OrdersProvider>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
