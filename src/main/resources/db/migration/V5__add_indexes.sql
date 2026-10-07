CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand    ON products(brand_id);
CREATE INDEX idx_products_active   ON products(active);
CREATE INDEX idx_products_price    ON products(price);
CREATE INDEX idx_products_cat_brand_price ON products(category_id, brand_id, price);
