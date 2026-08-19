import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { formatTzs, TZ_REGIONS, type Product } from "@/lib/shop";

export const Route = createFileRoute("/order/$productId")({
  head: () => ({
    meta: [
      { title: "Place your order — Duka la Kitenge" },
      {
        name: "description",
        content:
          "Send your order details: size, colour, quantity and delivery address anywhere in Tanzania. We confirm by phone or WhatsApp.",
      },
      { property: "og:title", content: "Place your order — Duka la Kitenge" },
      {
        property: "og:description",
        content: "Order handmade Tanzanian clothing and crafts with delivery countrywide.",
      },
    ],
  }),
  component: OrderPage,
});

type FormState = {
  customer_name: string;
  phone: string;
  email: string;
  region: string;
  city: string;
  delivery_address: string;
  size: string;
  color: string;
  quantity: number;
  notes: string;
};

const emptyForm: FormState = {
  customer_name: "",
  phone: "",
  email: "",
  region: TZ_REGIONS[0]!,
  city: "",
  delivery_address: "",
  size: "",
  color: "",
  quantity: 1,
  notes: "",
};

const fieldClass =
  "mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30";

function OrderPage() {
  const { productId } = useParams({ from: "/order/$productId" });
  const [form, setForm] = useState<FormState>(emptyForm);
  const [done, setDone] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .maybeSingle();
      if (error) throw error;
      return (data as Product | null) ?? null;
    },
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const mutation = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error("Product not found");
      const { error } = await supabase
        .from("orders")
        .insert({
          product_id: product.id,
          product_name: product.name,
          customer_name: form.customer_name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          region: form.region,
          city: form.city.trim() || null,
          delivery_address: form.delivery_address.trim(),
          size: form.size || null,
          color: form.color || null,
          quantity: form.quantity,
          notes: form.notes.trim() || null,
          total_tzs: product.price_tzs * form.quantity,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      setDone(true);
      toast.success("Order received — we'll confirm shortly.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not send your order. Please try again.");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-5 py-20">
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h1 className="text-3xl text-primary">Item not found</h1>
          <Link to="/" hash="catalog" className="mt-6 inline-block text-sm underline">
            Back to the catalogue
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-5 py-24 text-center">
          <div className="kitenge-rule mx-auto h-1.5 w-24 rounded-full" />
          <h1 className="mt-6 text-4xl text-primary">Asante sana!</h1>
          <p className="mt-4 text-muted-foreground">
            Your order for <strong className="text-foreground">{product.name}</strong> has been
            received. We will call or WhatsApp {form.phone} to confirm stock, delivery cost and
            payment.
          </p>
          <Link
            to="/"
            hash="catalog"
            className="mt-8 inline-flex rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Order something else
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const total = product.price_tzs * form.quantity;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto grid max-w-5xl gap-10 px-5 py-14 md:grid-cols-[1fr_320px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="order-2 md:order-1"
        >
          <h1 className="text-3xl text-primary">Place your order</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            No account needed — we confirm every order by phone or WhatsApp.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">
              Full name
              <input
                required
                value={form.customer_name}
                onChange={(e) => set("customer_name", e.target.value)}
                className={fieldClass}
                placeholder="Amina Juma"
              />
            </label>

            <label className="text-sm">
              Phone / WhatsApp
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={fieldClass}
                placeholder="+255 7XX XXX XXX"
              />
            </label>

            <label className="text-sm">
              Email (optional)
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={fieldClass}
                placeholder="you@example.com"
              />
            </label>

            <label className="text-sm">
              Region
              <select
                value={form.region}
                onChange={(e) => set("region", e.target.value)}
                className={fieldClass}
              >
                {TZ_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              Town / ward
              <input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className={fieldClass}
                placeholder="Masaki, Kinondoni"
              />
            </label>

            <label className="text-sm sm:col-span-2">
              Delivery address or pickup point
              <textarea
                required
                rows={2}
                value={form.delivery_address}
                onChange={(e) => set("delivery_address", e.target.value)}
                className={fieldClass}
                placeholder="Street, house number, nearest landmark or bus courier office"
              />
            </label>

            {product.sizes.length > 0 && (
              <label className="text-sm">
                Size
                <select
                  required
                  value={form.size}
                  onChange={(e) => set("size", e.target.value)}
                  className={fieldClass}
                >
                  <option value="">Select size</option>
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {product.colors.length > 0 && (
              <label className="text-sm">
                Colour
                <select
                  required
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                  className={fieldClass}
                >
                  <option value="">Select colour</option>
                  {product.colors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="text-sm">
              Quantity
              <input
                type="number"
                min={1}
                max={100}
                value={form.quantity}
                onChange={(e) => set("quantity", Math.max(1, Number(e.target.value) || 1))}
                className={fieldClass}
              />
            </label>

            <label className="text-sm sm:col-span-2">
              Notes (measurements, tailoring requests, delivery timing)
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                className={fieldClass}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-8 w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 sm:w-auto"
          >
            {mutation.isPending ? "Sending order…" : "Send order request"}
          </button>
        </form>

        <aside className="order-1 h-fit rounded-lg border border-border bg-card p-6 md:order-2 md:sticky md:top-28">
          <div className="kitenge-rule mb-4 h-1 w-12 rounded-full" />
          <h2 className="text-xl">{product.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Unit price</dt>
              <dd>{formatTzs(product.price_tzs)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Quantity</dt>
              <dd>{form.quantity}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-display text-base text-primary">
              <dt>Subtotal</dt>
              <dd>{formatTzs(total)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Delivery is quoted when we confirm your order. Pay by M-Pesa, Tigo Pesa, Airtel Money or
            cash on delivery.
          </p>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
