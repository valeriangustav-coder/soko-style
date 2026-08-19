import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { useWishlist } from "@/components/WishlistProvider";
import { PRODUCTS } from "@/lib/shop";
import { ProductCard } from "@/routes/index";
export const Route = createFileRoute("/wishlist")({ component: WishlistPage });
function WishlistPage() { const wishlist = useWishlist(); const products = PRODUCTS.filter((product) => wishlist.ids.includes(product.id)); return <div className="min-h-screen bg-[#f5f6f7]"><SiteHeader/><main className="mx-auto max-w-7xl px-4 py-10"><h1 className="text-3xl font-black">Your wishlist</h1><p className="mt-2 text-sm text-slate-500">Items you saved for later.</p>{products.length ? <div className="mt-7 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{products.map((product) => <ProductCard key={product.id} product={product}/>)}</div> : <div className="mt-8 rounded-2xl bg-white p-16 text-center shadow-sm"><Heart size={52} className="mx-auto text-slate-300"/><h2 className="mt-5 text-2xl font-bold">No saved items yet</h2><p className="mt-2 text-slate-500">Tap the heart on any product to keep it here.</p><Link to="/" className="mt-6 inline-block rounded-lg bg-emerald-700 px-6 py-3 font-bold text-white">Explore products</Link></div>}</main><SiteFooter/></div>; }
