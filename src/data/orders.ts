import type { Order, Refund } from '@/types';

export const sampleOrders: Order[] = [
  // ─── Aarav (USR001) - Several orders, completed refund ─────────────────
  {
    id: 'ORD001', userId: 'USR001', restaurantId: 'R001', restaurantName: 'Spice Route',
    items: [
      { menuItemId: 'M004', name: 'Butter Chicken', price: 319, quantity: 2, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80' },
      { menuItemId: 'M006', name: 'Garlic Naan', price: 59, quantity: 3, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
    ],
    subtotal: 815, deliveryFee: 30, tax: 41, discount: 100, total: 786,
    address: { id: 'A001', label: 'Home', street: '12 Senapati Bapat Road', city: 'Pune', state: 'Maharashtra', pincode: '411016' },
    paymentMethod: 'UPI', status: 'DELIVERED',
    createdAt: '2026-08-10T12:30:00Z', updatedAt: '2026-08-10T13:45:00Z', estimatedDelivery: '2026-08-10T13:05:00Z',
  },
  {
    id: 'ORD002', userId: 'USR001', restaurantId: 'R004', restaurantName: 'Curry Leaf',
    items: [
      { menuItemId: 'M027', name: 'Masala Dosa', price: 129, quantity: 2, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80' },
      { menuItemId: 'M031', name: 'Filter Coffee', price: 55, quantity: 2, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80' },
    ],
    subtotal: 368, deliveryFee: 25, tax: 18, discount: 80, total: 331,
    address: { id: 'A001', label: 'Home', street: '12 Senapati Bapat Road', city: 'Pune', state: 'Maharashtra', pincode: '411016' },
    paymentMethod: 'Card', status: 'DELIVERED',
    createdAt: '2026-08-20T08:00:00Z', updatedAt: '2026-08-20T08:50:00Z', estimatedDelivery: '2026-08-20T08:30:00Z',
  },
  {
    id: 'ORD003', userId: 'USR001', restaurantId: 'R009', restaurantName: 'Biryani Junction',
    items: [
      { menuItemId: 'M063', name: 'Hyderabadi Chicken Biryani', price: 349, quantity: 1, image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80' },
      { menuItemId: 'M068', name: 'Boondi Raita', price: 79, quantity: 1, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80' },
    ],
    subtotal: 428, deliveryFee: 35, tax: 21, discount: 0, total: 484,
    address: { id: 'A002', label: 'Work', street: '5th Floor, Cyber City Tower', city: 'Pune', state: 'Maharashtra', pincode: '411057' },
    paymentMethod: 'COD', status: 'DELIVERED',
    createdAt: '2026-09-01T13:00:00Z', updatedAt: '2026-09-01T14:10:00Z', estimatedDelivery: '2026-09-01T13:50:00Z',
  },

  // ─── Priya (USR002) - Several orders, pending refund ───────────────────
  {
    id: 'ORD004', userId: 'USR002', restaurantId: 'R002', restaurantName: 'The Bombay Tiffin',
    items: [
      { menuItemId: 'M012', name: 'Pav Bhaji', price: 149, quantity: 2, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80' },
      { menuItemId: 'M017', name: 'Cutting Chai', price: 25, quantity: 2, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80' },
    ],
    subtotal: 348, deliveryFee: 20, tax: 17, discount: 100, total: 285,
    address: { id: 'A003', label: 'Home', street: '7 Koregaon Park Lane', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    paymentMethod: 'UPI', status: 'DELIVERED',
    createdAt: '2026-08-25T10:00:00Z', updatedAt: '2026-08-25T10:40:00Z', estimatedDelivery: '2026-08-25T10:25:00Z',
  },
  {
    id: 'ORD005', userId: 'USR002', restaurantId: 'R010', restaurantName: 'Sweet Theory',
    items: [
      { menuItemId: 'M070', name: 'Red Velvet Cake (Slice)', price: 149, quantity: 2, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80' },
      { menuItemId: 'M075', name: 'Kulfi Falooda', price: 129, quantity: 1, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80' },
    ],
    subtotal: 427, deliveryFee: 25, tax: 21, discount: 0, total: 473,
    address: { id: 'A003', label: 'Home', street: '7 Koregaon Park Lane', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    paymentMethod: 'Wallet', status: 'DELIVERED',
    createdAt: '2026-09-05T16:00:00Z', updatedAt: '2026-09-05T16:45:00Z', estimatedDelivery: '2026-09-05T16:30:00Z',
  },

  // ─── Rohan (USR003) - Cancelled order, rejected refund ─────────────────
  {
    id: 'ORD006', userId: 'USR003', restaurantId: 'R003', restaurantName: 'Wok & Bowl',
    items: [
      { menuItemId: 'M022', name: 'Kung Pao Chicken', price: 299, quantity: 1, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80' },
      { menuItemId: 'M023', name: 'Veg Hakka Noodles', price: 199, quantity: 1, image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80' },
    ],
    subtotal: 498, deliveryFee: 35, tax: 25, discount: 75, total: 483,
    address: { id: 'A004', label: 'Home', street: '22 Baner Hills', city: 'Pune', state: 'Maharashtra', pincode: '411045' },
    paymentMethod: 'Card', status: 'CANCELLED',
    createdAt: '2026-08-18T19:00:00Z', updatedAt: '2026-08-18T19:20:00Z', estimatedDelivery: '2026-08-18T19:40:00Z',
  },
  {
    id: 'ORD007', userId: 'USR003', restaurantId: 'R006', restaurantName: 'Burger District',
    items: [
      { menuItemId: 'M041', name: 'Classic Smash Burger', price: 249, quantity: 2, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
      { menuItemId: 'M044', name: 'Loaded Fries', price: 149, quantity: 1, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&q=80' },
    ],
    subtotal: 647, deliveryFee: 15, tax: 32, discount: 0, total: 694,
    address: { id: 'A004', label: 'Home', street: '22 Baner Hills', city: 'Pune', state: 'Maharashtra', pincode: '411045' },
    paymentMethod: 'UPI', status: 'DELIVERED',
    createdAt: '2026-09-02T20:30:00Z', updatedAt: '2026-09-02T21:10:00Z', estimatedDelivery: '2026-09-02T20:50:00Z',
  },

  // ─── Kavya (USR004) - Frequent customer ────────────────────────────────
  {
    id: 'ORD008', userId: 'USR004', restaurantId: 'R004', restaurantName: 'Curry Leaf',
    items: [
      { menuItemId: 'M027', name: 'Masala Dosa', price: 129, quantity: 3, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80' },
      { menuItemId: 'M029', name: 'Kerala Fish Curry', price: 299, quantity: 1, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
      { menuItemId: 'M031', name: 'Filter Coffee', price: 55, quantity: 3, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80' },
    ],
    subtotal: 851, deliveryFee: 25, tax: 43, discount: 80, total: 839,
    address: { id: 'A006', label: 'Home', street: '15 Aundh Road', city: 'Pune', state: 'Maharashtra', pincode: '411007' },
    paymentMethod: 'Card', status: 'DELIVERED',
    createdAt: '2026-07-15T09:00:00Z', updatedAt: '2026-07-15T09:50:00Z', estimatedDelivery: '2026-07-15T09:30:00Z',
  },
  {
    id: 'ORD009', userId: 'USR004', restaurantId: 'R007', restaurantName: 'Dosa House',
    items: [
      { menuItemId: 'M052', name: 'Idli (2 pcs)', price: 69, quantity: 2, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
      { menuItemId: 'M050', name: 'Mysore Masala Dosa', price: 109, quantity: 1, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80' },
    ],
    subtotal: 247, deliveryFee: 20, tax: 12, discount: 120, total: 159,
    address: { id: 'A007', label: 'Work', street: 'Tech Park, Hinjewadi Phase 1', city: 'Pune', state: 'Maharashtra', pincode: '411057' },
    paymentMethod: 'UPI', status: 'DELIVERED',
    createdAt: '2026-08-01T08:30:00Z', updatedAt: '2026-08-01T09:00:00Z', estimatedDelivery: '2026-08-01T08:55:00Z',
  },
  {
    id: 'ORD010', userId: 'USR004', restaurantId: 'R009', restaurantName: 'Biryani Junction',
    items: [
      { menuItemId: 'M063', name: 'Hyderabadi Chicken Biryani', price: 349, quantity: 2, image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80' },
      { menuItemId: 'M067', name: 'Mirchi ka Salan', price: 99, quantity: 1, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
    ],
    subtotal: 797, deliveryFee: 35, tax: 40, discount: 200, total: 672,
    address: { id: 'A006', label: 'Home', street: '15 Aundh Road', city: 'Pune', state: 'Maharashtra', pincode: '411007' },
    paymentMethod: 'Wallet', status: 'DELIVERED',
    createdAt: '2026-09-07T13:30:00Z', updatedAt: '2026-09-07T14:30:00Z', estimatedDelivery: '2026-09-07T14:20:00Z',
  },

  // ─── Arjun (USR005) - New user, one order ──────────────────────────────
  {
    id: 'ORD011', userId: 'USR005', restaurantId: 'R009', restaurantName: 'Biryani Junction',
    items: [
      { menuItemId: 'M063', name: 'Hyderabadi Chicken Biryani', price: 349, quantity: 1, image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80' },
    ],
    subtotal: 349, deliveryFee: 35, tax: 17, discount: 87, total: 314,
    address: { id: 'A008', label: 'Home', street: '9 Hadapsar Ring Road', city: 'Pune', state: 'Maharashtra', pincode: '411028' },
    paymentMethod: 'COD', status: 'DELIVERED',
    createdAt: '2026-09-08T19:00:00Z', updatedAt: '2026-09-08T20:00:00Z', estimatedDelivery: '2026-09-08T19:50:00Z',
  },

  // ─── Sneha (USR006) - Several orders, refund under review ───────────────
  {
    id: 'ORD012', userId: 'USR006', restaurantId: 'R004', restaurantName: 'Curry Leaf',
    items: [
      { menuItemId: 'M028', name: 'Idli Vada Combo', price: 99, quantity: 2, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
      { menuItemId: 'M031', name: 'Filter Coffee', price: 55, quantity: 2, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80' },
    ],
    subtotal: 308, deliveryFee: 25, tax: 15, discount: 80, total: 268,
    address: { id: 'A009', label: 'Home', street: '45 Viman Nagar Main', city: 'Pune', state: 'Maharashtra', pincode: '411014' },
    paymentMethod: 'UPI', status: 'DELIVERED',
    createdAt: '2026-08-05T08:00:00Z', updatedAt: '2026-08-05T08:50:00Z', estimatedDelivery: '2026-08-05T08:30:00Z',
  },
  {
    id: 'ORD013', userId: 'USR006', restaurantId: 'R007', restaurantName: 'Dosa House',
    items: [
      { menuItemId: 'M049', name: 'Masala Dosa', price: 99, quantity: 3, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
    ],
    subtotal: 297, deliveryFee: 20, tax: 15, discount: 60, total: 272,
    address: { id: 'A010', label: 'Work', street: 'IT Park, Kharadi', city: 'Pune', state: 'Maharashtra', pincode: '411014' },
    paymentMethod: 'Card', status: 'DELIVERED',
    createdAt: '2026-08-22T12:00:00Z', updatedAt: '2026-08-22T12:45:00Z', estimatedDelivery: '2026-08-22T12:25:00Z',
  },
  {
    id: 'ORD014', userId: 'USR006', restaurantId: 'R002', restaurantName: 'The Bombay Tiffin',
    items: [
      { menuItemId: 'M012', name: 'Pav Bhaji', price: 149, quantity: 2, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80' },
      { menuItemId: 'M011', name: 'Vada Pav', price: 45, quantity: 4, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80' },
    ],
    subtotal: 478, deliveryFee: 20, tax: 24, discount: 100, total: 422,
    address: { id: 'A009', label: 'Home', street: '45 Viman Nagar Main', city: 'Pune', state: 'Maharashtra', pincode: '411014' },
    paymentMethod: 'UPI', status: 'DELIVERED',
    createdAt: '2026-09-03T18:30:00Z', updatedAt: '2026-09-03T19:15:00Z', estimatedDelivery: '2026-09-03T19:00:00Z',
  },

  // ─── Vikram (USR007) - Multiple orders, no refunds ──────────────────────
  {
    id: 'ORD015', userId: 'USR007', restaurantId: 'R001', restaurantName: 'Spice Route',
    items: [
      { menuItemId: 'M001', name: 'Chicken Tikka', price: 299, quantity: 1, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80' },
      { menuItemId: 'M003', name: 'Dal Makhani', price: 229, quantity: 1, image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&q=80' },
      { menuItemId: 'M006', name: 'Garlic Naan', price: 59, quantity: 4, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
    ],
    subtotal: 764, deliveryFee: 30, tax: 38, discount: 100, total: 732,
    address: { id: 'A011', label: 'Home', street: '3 Camp Area, Near MG Road', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    paymentMethod: 'Card', status: 'DELIVERED',
    createdAt: '2026-07-20T20:00:00Z', updatedAt: '2026-07-20T21:00:00Z', estimatedDelivery: '2026-07-20T20:35:00Z',
  },
  {
    id: 'ORD016', userId: 'USR007', restaurantId: 'R005', restaurantName: 'Urban Tandoor',
    items: [
      { menuItemId: 'M034', name: 'Seekh Kebab', price: 349, quantity: 2, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80' },
      { menuItemId: 'M038', name: 'Butter Naan', price: 49, quantity: 4, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
    ],
    subtotal: 894, deliveryFee: 40, tax: 45, discount: 180, total: 799,
    address: { id: 'A011', label: 'Home', street: '3 Camp Area, Near MG Road', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    paymentMethod: 'UPI', status: 'DELIVERED',
    createdAt: '2026-08-28T21:00:00Z', updatedAt: '2026-08-28T22:00:00Z', estimatedDelivery: '2026-08-28T21:45:00Z',
  },
  {
    id: 'ORD017', userId: 'USR007', restaurantId: 'R009', restaurantName: 'Biryani Junction',
    items: [
      { menuItemId: 'M064', name: 'Mutton Biryani', price: 449, quantity: 1, image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80' },
      { menuItemId: 'M068', name: 'Boondi Raita', price: 79, quantity: 1, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80' },
    ],
    subtotal: 528, deliveryFee: 35, tax: 26, discount: 0, total: 589,
    address: { id: 'A011', label: 'Home', street: '3 Camp Area, Near MG Road', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    paymentMethod: 'COD', status: 'DELIVERED',
    createdAt: '2026-09-06T13:00:00Z', updatedAt: '2026-09-06T14:10:00Z', estimatedDelivery: '2026-09-06T13:50:00Z',
  },

  // ─── Meera (USR008) - Cancelled order, refund request ──────────────────
  {
    id: 'ORD018', userId: 'USR008', restaurantId: 'R008', restaurantName: 'Pasta Street',
    items: [
      { menuItemId: 'M057', name: 'Spaghetti Carbonara', price: 349, quantity: 2, image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80' },
      { menuItemId: 'M059', name: 'Margherita Pizza', price: 349, quantity: 1, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80' },
    ],
    subtotal: 1047, deliveryFee: 30, tax: 52, discount: 100, total: 1029,
    address: { id: 'A012', label: 'Home', street: '18 Kothrud, Near Chandni Chowk', city: 'Pune', state: 'Maharashtra', pincode: '411038' },
    paymentMethod: 'Card', status: 'CANCELLED',
    createdAt: '2026-09-04T19:00:00Z', updatedAt: '2026-09-04T19:30:00Z', estimatedDelivery: '2026-09-04T19:35:00Z',
  },
  {
    id: 'ORD019', userId: 'USR008', restaurantId: 'R010', restaurantName: 'Sweet Theory',
    items: [
      { menuItemId: 'M070', name: 'Red Velvet Cake (Slice)', price: 149, quantity: 1, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80' },
      { menuItemId: 'M071', name: 'Chocolate Truffle Cake (Slice)', price: 159, quantity: 1, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80' },
    ],
    subtotal: 308, deliveryFee: 25, tax: 15, discount: 0, total: 348,
    address: { id: 'A013', label: 'Other', street: 'Block C, Magarpatta City', city: 'Pune', state: 'Maharashtra', pincode: '411013' },
    paymentMethod: 'UPI', status: 'DELIVERED',
    createdAt: '2026-09-08T15:00:00Z', updatedAt: '2026-09-08T15:45:00Z', estimatedDelivery: '2026-09-08T15:30:00Z',
  },

  // ─── Dev (USR009) - Several completed orders, processing refund ─────────
  {
    id: 'ORD020', userId: 'USR009', restaurantId: 'R001', restaurantName: 'Spice Route',
    items: [
      { menuItemId: 'M005', name: 'Chicken Biryani', price: 349, quantity: 2, image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80' },
      { menuItemId: 'M007', name: 'Gulab Jamun', price: 99, quantity: 1, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80' },
    ],
    subtotal: 797, deliveryFee: 30, tax: 40, discount: 100, total: 767,
    address: { id: 'A014', label: 'Home', street: '6 Shivajinagar, Near FC Road', city: 'Pune', state: 'Maharashtra', pincode: '411005' },
    paymentMethod: 'Card', status: 'DELIVERED',
    createdAt: '2026-07-10T13:00:00Z', updatedAt: '2026-07-10T14:10:00Z', estimatedDelivery: '2026-07-10T13:50:00Z',
  },
  {
    id: 'ORD021', userId: 'USR009', restaurantId: 'R003', restaurantName: 'Wok & Bowl',
    items: [
      { menuItemId: 'M022', name: 'Kung Pao Chicken', price: 299, quantity: 2, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80' },
      { menuItemId: 'M025', name: 'Honey Chilli Potato', price: 179, quantity: 1, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
    ],
    subtotal: 777, deliveryFee: 35, tax: 39, discount: 75, total: 776,
    address: { id: 'A014', label: 'Home', street: '6 Shivajinagar, Near FC Road', city: 'Pune', state: 'Maharashtra', pincode: '411005' },
    paymentMethod: 'UPI', status: 'DELIVERED',
    createdAt: '2026-08-05T19:30:00Z', updatedAt: '2026-08-05T20:30:00Z', estimatedDelivery: '2026-08-05T20:10:00Z',
  },
  {
    id: 'ORD022', userId: 'USR009', restaurantId: 'R006', restaurantName: 'Burger District',
    items: [
      { menuItemId: 'M041', name: 'Classic Smash Burger', price: 249, quantity: 3, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
      { menuItemId: 'M046', name: 'Chocolate Shake', price: 129, quantity: 3, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80' },
    ],
    subtotal: 1134, deliveryFee: 15, tax: 57, discount: 0, total: 1206,
    address: { id: 'A014', label: 'Home', street: '6 Shivajinagar, Near FC Road', city: 'Pune', state: 'Maharashtra', pincode: '411005' },
    paymentMethod: 'Card', status: 'DELIVERED',
    createdAt: '2026-09-07T21:00:00Z', updatedAt: '2026-09-07T21:45:00Z', estimatedDelivery: '2026-09-07T21:20:00Z',
  },

  // ─── Active/In-progress orders ──────────────────────────────────────────
  {
    id: 'ORD023', userId: 'USR001', restaurantId: 'R005', restaurantName: 'Urban Tandoor',
    items: [
      { menuItemId: 'M036', name: 'Tandoori Chicken Half', price: 399, quantity: 1, image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&q=80' },
      { menuItemId: 'M038', name: 'Butter Naan', price: 49, quantity: 3, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
    ],
    subtotal: 546, deliveryFee: 40, tax: 27, discount: 0, total: 613,
    address: { id: 'A001', label: 'Home', street: '12 Senapati Bapat Road', city: 'Pune', state: 'Maharashtra', pincode: '411016' },
    paymentMethod: 'UPI', status: 'OUT_FOR_DELIVERY',
    createdAt: '2026-09-09T19:00:00Z', updatedAt: '2026-09-09T19:45:00Z', estimatedDelivery: '2026-09-09T20:15:00Z',
  },
  {
    id: 'ORD024', userId: 'USR004', restaurantId: 'R007', restaurantName: 'Dosa House',
    items: [
      { menuItemId: 'M051', name: 'Cheese Dosa', price: 139, quantity: 2, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80' },
    ],
    subtotal: 278, deliveryFee: 20, tax: 14, discount: 0, total: 312,
    address: { id: 'A007', label: 'Work', street: 'Tech Park, Hinjewadi Phase 1', city: 'Pune', state: 'Maharashtra', pincode: '411057' },
    paymentMethod: 'Card', status: 'PREPARING',
    createdAt: '2026-09-09T20:00:00Z', updatedAt: '2026-09-09T20:10:00Z', estimatedDelivery: '2026-09-09T20:40:00Z',
  },
  {
    id: 'ORD025', userId: 'USR006', restaurantId: 'R010', restaurantName: 'Sweet Theory',
    items: [
      { menuItemId: 'M072', name: 'Kaju Katli (250g)', price: 249, quantity: 1, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80' },
      { menuItemId: 'M070', name: 'Red Velvet Cake (Slice)', price: 149, quantity: 2, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80' },
    ],
    subtotal: 547, deliveryFee: 25, tax: 27, discount: 0, total: 599,
    address: { id: 'A009', label: 'Home', street: '45 Viman Nagar Main', city: 'Pune', state: 'Maharashtra', pincode: '411014' },
    paymentMethod: 'UPI', status: 'CONFIRMED',
    createdAt: '2026-09-09T20:30:00Z', updatedAt: '2026-09-09T20:35:00Z', estimatedDelivery: '2026-09-09T21:10:00Z',
  },
];

export const sampleRefunds: Refund[] = [
  {
    id: 'RF001', orderId: 'ORD006', userId: 'USR003', restaurantId: 'R003',
    amount: 483, reason: 'RESTAURANT_CANCELLED', description: 'Restaurant cancelled my order after 30 minutes. Order never arrived.',
    status: 'PENDING',
    timeline: [{ status: 'PENDING', date: '2026-08-18T19:30:00Z', note: 'Refund request submitted' }],
    createdAt: '2026-08-18T19:30:00Z', updatedAt: '2026-08-18T19:30:00Z',
  },
  {
    id: 'RF002', orderId: 'ORD004', userId: 'USR002', restaurantId: 'R002',
    amount: 285, reason: 'WRONG_ITEM', description: 'Received vada pav instead of the pav bhaji I ordered. Wrong items delivered.',
    status: 'UNDER_REVIEW',
    timeline: [
      { status: 'PENDING', date: '2026-08-25T11:00:00Z', note: 'Refund request submitted' },
      { status: 'UNDER_REVIEW', date: '2026-08-25T13:00:00Z', note: 'Team is reviewing your request' },
    ],
    createdAt: '2026-08-25T11:00:00Z', updatedAt: '2026-08-25T13:00:00Z',
  },
  {
    id: 'RF003', orderId: 'ORD001', userId: 'USR001', restaurantId: 'R001',
    amount: 786, reason: 'FOOD_QUALITY', description: 'The butter chicken was stale and had an off smell. Food quality was very poor.',
    status: 'APPROVED',
    timeline: [
      { status: 'PENDING', date: '2026-08-10T14:00:00Z' },
      { status: 'UNDER_REVIEW', date: '2026-08-10T15:00:00Z' },
      { status: 'APPROVED', date: '2026-08-11T10:00:00Z', note: 'Refund approved after review' },
    ],
    createdAt: '2026-08-10T14:00:00Z', updatedAt: '2026-08-11T10:00:00Z',
  },
  {
    id: 'RF004', orderId: 'ORD007', userId: 'USR003', restaurantId: 'R006',
    amount: 694, reason: 'MISSING_ITEM', description: 'The loaded fries were missing from my delivery. Only received the burgers.',
    status: 'REJECTED',
    timeline: [
      { status: 'PENDING', date: '2026-09-02T21:30:00Z' },
      { status: 'UNDER_REVIEW', date: '2026-09-03T09:00:00Z' },
      { status: 'REJECTED', date: '2026-09-03T15:00:00Z', note: 'Delivery partner confirmed all items were delivered. Request rejected.' },
    ],
    createdAt: '2026-09-02T21:30:00Z', updatedAt: '2026-09-03T15:00:00Z', adminNote: 'GPS logs confirmed delivery of all items.',
  },
  {
    id: 'RF005', orderId: 'ORD020', userId: 'USR009', restaurantId: 'R001',
    amount: 767, reason: 'FOOD_DAMAGED', description: 'The biryani container was completely spilled — packaging was torn.',
    status: 'PROCESSING',
    timeline: [
      { status: 'PENDING', date: '2026-07-10T14:30:00Z' },
      { status: 'UNDER_REVIEW', date: '2026-07-10T16:00:00Z' },
      { status: 'APPROVED', date: '2026-07-11T10:00:00Z' },
      { status: 'PROCESSING', date: '2026-07-11T12:00:00Z', note: 'Refund is being processed to your payment method' },
    ],
    createdAt: '2026-07-10T14:30:00Z', updatedAt: '2026-07-11T12:00:00Z',
  },
  {
    id: 'RF006', orderId: 'ORD002', userId: 'USR001', restaurantId: 'R004',
    amount: 331, reason: 'ORDER_NEVER_ARRIVED', description: 'Waited over 2 hours. Order marked delivered but nothing arrived.',
    status: 'COMPLETED',
    timeline: [
      { status: 'PENDING', date: '2026-08-20T11:00:00Z' },
      { status: 'UNDER_REVIEW', date: '2026-08-20T12:00:00Z' },
      { status: 'APPROVED', date: '2026-08-21T09:00:00Z' },
      { status: 'PROCESSING', date: '2026-08-21T10:00:00Z' },
      { status: 'COMPLETED', date: '2026-08-22T09:00:00Z', note: 'Refund of ₹331 credited to your original payment method' },
    ],
    createdAt: '2026-08-20T11:00:00Z', updatedAt: '2026-08-22T09:00:00Z', resolvedAt: '2026-08-22T09:00:00Z',
  },
  {
    id: 'RF007', orderId: 'ORD015', userId: 'USR007', restaurantId: 'R001',
    amount: 732, reason: 'DUPLICATE_PAYMENT', description: 'Was charged twice for the same order. Please refund the duplicate payment.',
    status: 'COMPLETED',
    timeline: [
      { status: 'PENDING', date: '2026-07-20T21:30:00Z' },
      { status: 'UNDER_REVIEW', date: '2026-07-21T09:00:00Z' },
      { status: 'APPROVED', date: '2026-07-21T14:00:00Z', note: 'Duplicate transaction confirmed' },
      { status: 'PROCESSING', date: '2026-07-21T15:00:00Z' },
      { status: 'COMPLETED', date: '2026-07-22T10:00:00Z', note: 'Duplicate charge of ₹732 refunded to your card' },
    ],
    createdAt: '2026-07-20T21:30:00Z', updatedAt: '2026-07-22T10:00:00Z', resolvedAt: '2026-07-22T10:00:00Z',
  },
  {
    id: 'RF008', orderId: 'ORD018', userId: 'USR008', restaurantId: 'R008',
    amount: 1029, reason: 'RESTAURANT_CANCELLED', description: 'Restaurant cancelled my order after I waited for an hour. No explanation given.',
    status: 'UNDER_REVIEW',
    timeline: [
      { status: 'PENDING', date: '2026-09-04T20:00:00Z', note: 'Refund request submitted' },
      { status: 'UNDER_REVIEW', date: '2026-09-05T09:00:00Z', note: 'We are reviewing your case' },
    ],
    createdAt: '2026-09-04T20:00:00Z', updatedAt: '2026-09-05T09:00:00Z',
  },
  {
    id: 'RF009', orderId: 'ORD014', userId: 'USR006', restaurantId: 'R002',
    amount: 422, reason: 'MISSING_ITEM', description: '2 vada pavs were missing from the order. Only the pav bhaji was delivered.',
    status: 'APPROVED',
    timeline: [
      { status: 'PENDING', date: '2026-09-03T19:45:00Z' },
      { status: 'UNDER_REVIEW', date: '2026-09-04T09:00:00Z' },
      { status: 'APPROVED', date: '2026-09-04T14:00:00Z', note: 'Missing items confirmed. Partial refund of ₹422 approved.' },
    ],
    createdAt: '2026-09-03T19:45:00Z', updatedAt: '2026-09-04T14:00:00Z',
  },
];
