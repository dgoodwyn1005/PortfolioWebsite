-- Create digital products table for chord packs and other downloadable products
CREATE TABLE IF NOT EXISTS digital_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  product_type TEXT DEFAULT 'chord_pack', -- chord_pack, midi_pack, sample_pack, preset_pack, etc.
  gumroad_url TEXT, -- External Gumroad link
  stripe_price_id TEXT, -- For native Stripe checkout
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_coming_soon BOOLEAN DEFAULT false, -- For waitlist/pre-launch products
  waitlist_enabled BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]'::jsonb, -- Array of feature strings
  tags JSONB DEFAULT '[]'::jsonb, -- Tags like "gospel", "jazz", "pop"
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create waitlist signups table
CREATE TABLE IF NOT EXISTS product_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES digital_products(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notified_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE digital_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_waitlist ENABLE ROW LEVEL SECURITY;

-- Policies for digital_products
CREATE POLICY "Public read digital_products" ON digital_products FOR SELECT USING (true);
CREATE POLICY "Admin manage digital_products" ON digital_products FOR ALL USING (true);

-- Policies for product_waitlist
CREATE POLICY "Anyone can join waitlist" ON product_waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read waitlist" ON product_waitlist FOR SELECT USING (true);
CREATE POLICY "Admin manage waitlist" ON product_waitlist FOR ALL USING (true);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_digital_products_company ON digital_products(company_id);
CREATE INDEX IF NOT EXISTS idx_digital_products_visible ON digital_products(is_visible, display_order);
CREATE INDEX IF NOT EXISTS idx_product_waitlist_product ON product_waitlist(product_id);
