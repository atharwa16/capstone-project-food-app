import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter a valid phone number (at least 10 digits).'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export const orderSchema = z.object({
  userId: z.string().min(1, 'User ID is required.'),
  restaurantId: z.string().min(1, 'Restaurant ID is required.'),
  restaurantName: z.string().min(1, 'Restaurant name is required.'),
  items: z.array(z.object({
    menuItemId: z.string(),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
  })).min(1, 'Cart must contain at least 1 item.'),
  subtotal: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().positive('Total price must be greater than 0.'),
  address: z.object({
    street: z.string().min(1, 'Street address is required.'),
    city: z.string().min(1, 'City is required.'),
  }),
});

export const refundSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required.'),
  userId: z.string().min(1, 'User ID is required.'),
  amount: z.number().positive('Refund amount must be positive.'),
  reason: z.string().min(1, 'Refund reason is required.'),
  description: z.string().optional(),
});

export function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const issues = err.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
        return res.status(400).json({ error: `Validation failed: ${issues}`, issues: err.issues });
      }
      return res.status(400).json({ error: 'Invalid payload structure.' });
    }
  };
}
