import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
type WishlistValue = { ids: string[]; toggle: (id: string) => void; has: (id: string) => boolean };
const WishlistContext = createContext<WishlistValue | null>(null);
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]); const [ready, setReady] = useState(false);
  useEffect(() => { try { setIds(JSON.parse(localStorage.getItem("soko-wishlist") || "[]")); } catch { setIds([]); } setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem("soko-wishlist", JSON.stringify(ids)); }, [ids, ready]);
  const value = useMemo(() => ({ ids, toggle: (id: string) => setIds((current) => { const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]; localStorage.setItem("soko-wishlist", JSON.stringify(next)); return next; }), has: (id: string) => ids.includes(id) }), [ids]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
export function useWishlist() { const value = useContext(WishlistContext); if (!value) throw new Error("Wishlist provider missing"); return value; }
