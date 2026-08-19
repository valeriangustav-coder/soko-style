CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'clothing',
  price_tzs integer NOT NULL DEFAULT 0,
  image_url text,
  sizes text[] NOT NULL DEFAULT ARRAY['S','M','L','XL'],
  colors text[] NOT NULL DEFAULT ARRAY[]::text[],
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  region text NOT NULL,
  city text,
  delivery_address text NOT NULL,
  size text,
  color text,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0 AND quantity <= 100),
  notes text,
  total_tzs integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.orders TO anon;
GRANT INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can place an order" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);

INSERT INTO public.products (name, description, category, price_tzs, sizes, colors) VALUES
('Kitenge Wrap Dress', 'Hand-cut kitenge wrap dress sewn in Dar es Salaam, lined and finished with a tie waist.', 'clothing', 85000, ARRAY['S','M','L','XL'], ARRAY['Indigo','Gold','Rust']),
('Maasai Shuka Blanket', 'Classic checked Maasai shuka, thick woven cotton, warm for the highlands.', 'home', 45000, ARRAY['One size'], ARRAY['Red','Blue','Purple']),
('Kanga Two-Piece Set', 'Traditional kanga pair with printed Swahili proverb border.', 'clothing', 38000, ARRAY['One size'], ARRAY['Green','Yellow','Black']),
('Men''s Kitenge Shirt', 'Short-sleeve kitenge shirt with wooden buttons, tailored fit.', 'clothing', 62000, ARRAY['M','L','XL','XXL'], ARRAY['Teal','Ochre','Charcoal']),
('Zanzibar Linen Kaftan', 'Airy linen kaftan with hand embroidery around the neckline.', 'clothing', 95000, ARRAY['S','M','L'], ARRAY['Cream','Sand','Ocean']),
('Beaded Maasai Necklace', 'Layered beadwork collar made by artisans in Arusha.', 'accessories', 28000, ARRAY['One size'], ARRAY['Multicolour','White','Red']),
('Leather Sandals (Kiatu)', 'Hand-stitched leather sandals from Moshi, soft footbed.', 'accessories', 40000, ARRAY['38','39','40','41','42','43'], ARRAY['Tan','Dark brown']),
('Kitenge Head Wrap', 'Two-metre kitenge head wrap, pre-washed and colourfast.', 'accessories', 15000, ARRAY['One size'], ARRAY['Gold','Indigo','Green']),
('Tingatinga Canvas Print', 'Bright Tingatinga-style painted canvas, ready to hang.', 'home', 120000, ARRAY['40x60cm','60x90cm'], ARRAY['Savannah','Village','Birds']),
('Woven Sisal Basket', 'Handwoven sisal shopping basket with leather handles.', 'home', 32000, ARRAY['Medium','Large'], ARRAY['Natural','Black stripe']);