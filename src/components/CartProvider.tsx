import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/lib/shop";
export type CartItem = { productId: string; quantity: number; size: string; color: string };
type CartValue = { items: CartItem[]; count: number; subtotal: number; addItem: (product: Product, size: string, color: string, quantity?: number) => void; updateQuantity: (index: number, quantity: number) => void; removeItem: (index: number) => void; clearCart: () => void };
const CartContext = createContext<CartValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]); const [ready, setReady] = useState(false);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem("soko-cart") || "[]")); } catch { setItems([]); } setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem("soko-cart", JSON.stringify(items)); }, [items, ready]);
  const value = useMemo<CartValue>(() => ({ items, count: items.reduce((s, i) => s + i.quantity, 0), subtotal: items.reduce((s, i) => s + (PRODUCTS.find((p) => p.id === i.productId)?.price_tzs || 0) * i.quantity, 0), addItem: (product, size, color, quantity = 1) => setItems((current) => { const index = current.findIndex((i) => i.productId === product.id && i.size === size && i.color === color); return index < 0 ? [...current, { productId: product.id, size, color, quantity }] : current.map((i, n) => n === index ? { ...i, quantity: i.quantity + quantity } : i); }), updateQuantity: (index, quantity) => setItems((c) => c.map((i, n) => n === index ? { ...i, quantity: Math.max(1, quantity) } : i)), removeItem: (index) => setItems((c) => c.filter((_, n) => n !== index)), clearCart: () => setItems([]) }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error("Cart provider missing"); return value; }
