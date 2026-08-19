import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How ordering works — Duka la Kitenge Tanzania" },
      {
        name: "description",
        content:
          "Order kitenge clothing, kanga, sandals and homeware anywhere in Tanzania: choose an item, send your details, confirm on WhatsApp, pay on delivery.",
      },
      { property: "og:title", content: "How ordering works — Duka la Kitenge" },
      {
        property: "og:description",
        content: "Four simple steps from catalogue to doorstep delivery across Tanzania.",
      },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  {
    title: "Choose your piece",
    body: "Browse the catalogue and pick a size and colour. Everything is made or sourced locally in Tanzania.",
  },
  {
    title: "Send your order",
    body: "Fill in your name, phone number, region and delivery address. No account needed.",
  },
  {
    title: "We confirm on WhatsApp",
    body: "Our team calls or messages you within a few hours to confirm stock, tailoring time and delivery cost.",
  },
  {
    title: "Delivery & payment",
    body: "Dar es Salaam deliveries take 1–2 days; upcountry and Zanzibar 2–5 days by bus courier. Pay by mobile money or cash on delivery.",
  },
];

function HowItWorks() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-4xl text-primary">How ordering works</h1>
        <p className="mt-3 text-muted-foreground">
          A simple order flow built for Tanzania — mobile money, WhatsApp confirmation and bus
          courier delivery countrywide.
        </p>

        <ol className="mt-10 space-y-6">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-5 rounded-lg border border-border bg-card p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-display text-lg text-accent-foreground">
                {i + 1}
              </span>
              <div>
                <h2 className="text-lg">{step.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <Link
          to="/"
          hash="catalog"
          className="mt-10 inline-flex rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Browse the catalogue
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
