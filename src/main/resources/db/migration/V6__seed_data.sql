-- Seed Categories
INSERT INTO categories (name, slug, description, created_at)
VALUES 
  ('Skincare', 'skincare', 'Serums, moisturizers, cleansers, and sunscreens', NOW()),
  ('Makeup', 'makeup', 'Lipsticks, foundations, eyeliners, and palettes', NOW()),
  ('Haircare', 'haircare', 'Shampoos, conditioners, and hair styling oils', NOW()),
  ('Fragrance', 'fragrance', 'Luxury perfumes and long-lasting mists', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Seed Brands
INSERT INTO brands (name, slug, logo_url, created_at)
VALUES 
  ('Nykaa Cosmetics', 'nykaa-cosmetics', 'https://images.glowcart.com/brands/nykaa.png', NOW()),
  ('Maybelline New York', 'maybelline', 'https://images.glowcart.com/brands/maybelline.png', NOW()),
  ('The Ordinary', 'the-ordinary', 'https://images.glowcart.com/brands/the-ordinary.png', NOW()),
  ('MAC Cosmetics', 'mac', 'https://images.glowcart.com/brands/mac.png', NOW()),
  ('Huda Beauty', 'huda-beauty', 'https://images.glowcart.com/brands/huda.png', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Seed Products
INSERT INTO products (name, slug, description, price, stock_quantity, image_url, category_id, brand_id, active, version, created_at, updated_at)
VALUES 
  (
    'Niacinamide 10% + Zinc 1%', 
    'niacinamide-10-zinc-1', 
    'High-strength vitamin and mineral blemish formula for smooth, bright skin texture.', 
    12.99, 
    500, 
    'https://images.glowcart.com/products/ordinary-niacinamide.jpg', 
    (SELECT id FROM categories WHERE slug = 'skincare'), 
    (SELECT id FROM brands WHERE slug = 'the-ordinary'), 
    TRUE, 0, NOW(), NOW()
  ),
  (
    'Hyaluronic Acid 2% + B5', 
    'hyaluronic-acid-2-b5', 
    'Hydrating serum that delivers multi-depth hydration and visible plumping.', 
    14.50, 
    350, 
    'https://images.glowcart.com/products/ordinary-ha.jpg', 
    (SELECT id FROM categories WHERE slug = 'skincare'), 
    (SELECT id FROM brands WHERE slug = 'the-ordinary'), 
    TRUE, 0, NOW(), NOW()
  ),
  (
    'Matte Revolution Liquid Lipstick - Chai', 
    'matte-revolution-liquid-lipstick-chai', 
    'All-day weightless matte liquid lipstick infused with Vitamin E.', 
    18.00, 
    200, 
    'https://images.glowcart.com/products/nykaa-chai.jpg', 
    (SELECT id FROM categories WHERE slug = 'makeup'), 
    (SELECT id FROM brands WHERE slug = 'nykaa-cosmetics'), 
    TRUE, 0, NOW(), NOW()
  ),
  (
    'SuperStay Matte Ink Liquid Lipstick', 
    'superstay-matte-ink-lipstick', 
    'Flawless 16-hour saturated liquid matte finish that will not transfer.', 
    10.99, 
    400, 
    'https://images.glowcart.com/products/maybelline-matte-ink.jpg', 
    (SELECT id FROM categories WHERE slug = 'makeup'), 
    (SELECT id FROM brands WHERE slug = 'maybelline'), 
    TRUE, 0, NOW(), NOW()
  ),
  (
    'Retro Matte Lipstick - Ruby Woo', 
    'retro-matte-ruby-woo', 
    'The iconic vivid blue-red shade with long-wearing velvety matte texture.', 
    23.00, 
    150, 
    'https://images.glowcart.com/products/mac-ruby-woo.jpg', 
    (SELECT id FROM categories WHERE slug = 'makeup'), 
    (SELECT id FROM brands WHERE slug = 'mac'), 
    TRUE, 0, NOW(), NOW()
  ),
  (
    'Flash Sale Limited Serum', 
    'flash-sale-limited-serum', 
    'Ultra-rare limited formulation beauty serum for concurrency & oversell testing.', 
    45.00, 
    10, 
    'https://images.glowcart.com/products/limited-serum.jpg', 
    (SELECT id FROM categories WHERE slug = 'skincare'), 
    (SELECT id FROM brands WHERE slug = 'huda-beauty'), 
    TRUE, 0, NOW(), NOW()
  )
ON CONFLICT (slug) DO NOTHING;
