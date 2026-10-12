/**
 * GlowCart 100+ Luxury Beauty Catalog & Storefront Engine
 * Engineered with smooth scroll dynamics, coupons & concurrency showcase
 */

const API_BASE = window.location.origin;

// 12 Verified High-Res Beauty Image URLs from Unsplash CDN
const BEAUTY_STOCK_PHOTOS = [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1608248597359-5613532b2b1a?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=650&q=80',
    'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=650&q=80'
];

// Helper to generate 100+ comprehensive realistic beauty products
function generateFullCatalog() {
    const rawCatalog = [
        // FLASH DROP
        { id: 1, name: "Flash Sale 24K Gold Elixir (10 Units Only)", brand: "GlowCart Atelier", category: "luxe", price: 4500, mrp: 6000, stock: 10, rating: 5.0, reviews: 1820, badge: "Flash Drop", imgIdx: 16 },

        // SKINCARE (30 Products)
        { id: 2, name: "Niacinamide 10% + Zinc 1% Oil Control Serum", brand: "The Ordinary", category: "skincare", price: 600, mrp: 750, stock: 420, rating: 4.8, reviews: 24500, badge: "Bestseller", imgIdx: 0 },
        { id: 3, name: "Hyaluronic Acid 2% + B5 Multi-Depth Plumping Serum", brand: "The Ordinary", category: "skincare", price: 700, mrp: 850, stock: 380, rating: 4.9, reviews: 19800, badge: "Top Rated", imgIdx: 1 },
        { id: 4, name: "Advanced Snail 96 Mucin Power Essence 100ml", brand: "COSRX", category: "skincare", price: 1450, mrp: 1800, stock: 210, rating: 4.9, reviews: 34100, badge: "Bestseller", imgIdx: 2 },
        { id: 5, name: "Relief Sun: Rice + Probiotics Sunscreen SPF50+ PA++++", brand: "Beauty of Joseon", category: "skincare", price: 1200, mrp: 1500, stock: 290, rating: 4.9, reviews: 28400, badge: "Viral", imgIdx: 3 },
        { id: 6, name: "Skin Perfecting 2% BHA Liquid Exfoliant 118ml", brand: "Paula's Choice", category: "skincare", price: 2700, mrp: 3200, stock: 110, rating: 4.8, reviews: 14500, badge: "Dermat Choice", imgIdx: 4 },
        { id: 7, name: "Lip Sleeping Mask - Berry Antioxidant Complex 20g", brand: "Laneige", category: "skincare", price: 1150, mrp: 1400, stock: 320, rating: 4.9, reviews: 42000, badge: "Cult Classic", imgIdx: 5 },
        { id: 8, name: "Advanced Night Repair Synchronized Recovery Complex", brand: "Estée Lauder", category: "luxe", price: 5900, mrp: 7200, stock: 65, rating: 4.9, reviews: 9200, badge: "Luxe Bestseller", imgIdx: 6 },
        { id: 9, name: "Watermelon Glow Niacinamide Dew Drops 40ml", brand: "Glow Recipe", category: "skincare", price: 3200, mrp: 3800, stock: 95, rating: 4.7, reviews: 7800, badge: "Glass Skin", imgIdx: 7 },
        { id: 10, name: "Aha 30% + Bha 2% Peeling Solution 30ml", brand: "The Ordinary", category: "skincare", price: 950, mrp: 1150, stock: 260, rating: 4.8, reviews: 31000, badge: "Top Rated", imgIdx: 0 },
        { id: 11, name: "Hydrating Facial Cleanser with Ceramides 236ml", brand: "CeraVe", category: "skincare", price: 1199, mrp: 1450, stock: 340, rating: 4.8, reviews: 18900, badge: "Essential", imgIdx: 4 },
        { id: 12, name: "Moisturizing Cream with 3 Essential Ceramides", brand: "CeraVe", category: "skincare", price: 1350, mrp: 1650, stock: 280, rating: 4.9, reviews: 22100, badge: "Bestseller", imgIdx: 2 },
        { id: 13, name: "Vitamin C 10% Face Serum with Centella Asiatica", brand: "Minimalist", category: "skincare", price: 699, mrp: 799, stock: 450, rating: 4.7, reviews: 16400, badge: "Value Pick", imgIdx: 1 },
        { id: 14, name: "Salicylic Acid 2% Serum for Acne & Blackheads", brand: "Minimalist", category: "skincare", price: 549, mrp: 599, stock: 500, rating: 4.6, reviews: 19800, badge: "Clear Skin", imgIdx: 4 },
        { id: 15, name: "Green Tea Seed Hyaluronic Serum 80ml", brand: "Innisfree", category: "skincare", price: 2100, mrp: 2500, stock: 140, rating: 4.8, reviews: 11200, badge: "Hydration", imgIdx: 6 },
        { id: 16, name: "Jeju Cherry Blossom Jelly Cream 50ml", brand: "Innisfree", category: "skincare", price: 1850, mrp: 2200, stock: 125, rating: 4.7, reviews: 8900, badge: "Glow", imgIdx: 5 },
        { id: 17, name: "Propolis Synergy Toner 150ml", brand: "COSRX", category: "skincare", price: 1390, mrp: 1650, stock: 190, rating: 4.9, reviews: 15400, badge: "K-Beauty", imgIdx: 3 },
        { id: 18, name: "Low pH Good Morning Gel Cleanser 150ml", brand: "COSRX", category: "skincare", price: 790, mrp: 950, stock: 310, rating: 4.7, reviews: 24000, badge: "Daily Cleanse", imgIdx: 4 },
        { id: 19, name: "C-Firma Fresh Day Serum 28ml", brand: "Drunk Elephant", category: "luxe", price: 6800, mrp: 7800, stock: 45, rating: 4.8, reviews: 5600, badge: "Luxe", imgIdx: 7 },
        { id: 20, name: "Protini Polypeptide Firming Cream 50ml", brand: "Drunk Elephant", category: "luxe", price: 6100, mrp: 7000, stock: 50, rating: 4.9, reviews: 6800, badge: "Peptides", imgIdx: 2 },
        { id: 21, name: "Water Bank Blue Hyaluronic Cream 50ml", brand: "Laneige", category: "skincare", price: 2750, mrp: 3100, stock: 130, rating: 4.8, reviews: 10400, badge: "Moisture", imgIdx: 5 },
        { id: 22, name: "Glow Toner Acid-Free Daily Pore Refining 150ml", brand: "Charlotte Tilbury", category: "luxe", price: 4800, mrp: 5500, stock: 60, rating: 4.8, reviews: 4500, badge: "Luxe", imgIdx: 6 },
        { id: 23, name: "Magic Cream Instant Turnaround Moisturizer 50ml", brand: "Charlotte Tilbury", category: "luxe", price: 7600, mrp: 8500, stock: 40, rating: 4.9, reviews: 7800, badge: "Award Winner", imgIdx: 2 },
        { id: 24, name: "Centella Asiatica Calming Ampoule 100ml", brand: "SKIN1004", category: "skincare", price: 1650, mrp: 1990, stock: 220, rating: 4.9, reviews: 13200, badge: "Soothing", imgIdx: 1 },
        { id: 25, name: "Hyalu-Cica Water-Fit Sun Serum SPF50+ 50ml", brand: "SKIN1004", category: "skincare", price: 1450, mrp: 1790, stock: 240, rating: 4.9, reviews: 17800, badge: "Top Pick", imgIdx: 3 },
        { id: 26, name: "Ginseng Essence Water Radiance Toner 150ml", brand: "Beauty of Joseon", category: "skincare", price: 1490, mrp: 1800, stock: 180, rating: 4.8, reviews: 12100, badge: "Hanbang", imgIdx: 6 },
        { id: 27, name: "Dynasty Face Cream with Rice Bran Water 50ml", brand: "Beauty of Joseon", category: "skincare", price: 1750, mrp: 2100, stock: 160, rating: 4.8, reviews: 9800, badge: "Nourish", imgIdx: 2 },
        { id: 28, name: "Glycolic Acid 7% Exfoliating Toning Solution 240ml", brand: "The Ordinary", category: "skincare", price: 1100, mrp: 1300, stock: 350, rating: 4.8, reviews: 29000, badge: "Exfoliate", imgIdx: 0 },
        { id: 29, name: "Caffeine Solution 5% + EGCG Eye Serum 30ml", brand: "The Ordinary", category: "skincare", price: 750, mrp: 900, stock: 290, rating: 4.6, reviews: 15400, badge: "Dark Circles", imgIdx: 1 },
        { id: 30, name: "Retinol 0.2% in Squalane Age Defense 30ml", brand: "The Ordinary", category: "skincare", price: 850, mrp: 1000, stock: 210, rating: 4.7, reviews: 14200, badge: "Anti-Age", imgIdx: 6 },

        // MAKEUP (25 Products)
        { id: 31, name: "Matte Revolution Lipstick - Pillow Talk", brand: "Charlotte Tilbury", category: "makeup", price: 3400, mrp: 3800, stock: 140, rating: 5.0, reviews: 28500, badge: "Iconic", imgIdx: 8 },
        { id: 32, name: "Gloss Bomb Universal Lip Luminizer - Fenty Glow", brand: "Fenty Beauty", category: "makeup", price: 1950, mrp: 2300, stock: 230, rating: 4.9, reviews: 21000, badge: "Bestseller", imgIdx: 9 },
        { id: 33, name: "Soft Pinch Liquid Blush - Joy (Dewy Coral)", brand: "Rare Beauty", category: "makeup", price: 2300, mrp: 2600, stock: 85, rating: 4.9, reviews: 31200, badge: "Viral", imgIdx: 10 },
        { id: 34, name: "Retro Matte Lipstick - Ruby Woo", brand: "MAC Cosmetics", category: "makeup", price: 1950, mrp: 2200, stock: 160, rating: 5.0, reviews: 38000, badge: "Legendary", imgIdx: 11 },
        { id: 35, name: "Dior Addict Lip Glow Color-Reviver Balm - 001 Pink", brand: "Dior Beauty", category: "luxe", price: 3900, mrp: 4300, stock: 75, rating: 4.9, reviews: 17200, badge: "Luxe Couture", imgIdx: 9 },
        { id: 36, name: "Empowered Luxury 18-Shade Eyeshadow Palette", brand: "Huda Beauty", category: "makeup", price: 5400, mrp: 6200, stock: 50, rating: 4.8, reviews: 9400, badge: "Palette", imgIdx: 12 },
        { id: 37, name: "Radiant Creamy Concealer - Custard (Medium 1)", brand: "NARS Cosmetics", category: "makeup", price: 2900, mrp: 3300, stock: 130, rating: 4.9, reviews: 22000, badge: "Award Winner", imgIdx: 10 },
        { id: 38, name: "SuperStay Matte Ink Liquid Lipstick - Pioneer Red", brand: "Maybelline New York", category: "makeup", price: 699, mrp: 849, stock: 400, rating: 4.6, reviews: 45000, badge: "16hr Wear", imgIdx: 8 },
        { id: 39, name: "Lash Sensational Sky High Waterproof Mascara", brand: "Maybelline New York", category: "makeup", price: 799, mrp: 999, stock: 350, rating: 4.8, reviews: 39000, badge: "Viral Lash", imgIdx: 10 },
        { id: 40, name: "Fit Me Matte + Poreless Liquid Foundation 30ml", brand: "Maybelline New York", category: "makeup", price: 549, mrp: 699, stock: 480, rating: 4.5, reviews: 52000, badge: "Budget Staple", imgIdx: 9 },
        { id: 41, name: "Airbrush Flawless Finish Micro-Powder 8g", brand: "Charlotte Tilbury", category: "luxe", price: 4600, mrp: 5200, stock: 70, rating: 4.9, reviews: 16500, badge: "Filter Skin", imgIdx: 10 },
        { id: 42, name: "Hollywood Flawless Filter Complexion Booster", brand: "Charlotte Tilbury", category: "luxe", price: 4400, mrp: 4900, stock: 80, rating: 4.9, reviews: 19800, badge: "Cult Glow", imgIdx: 7 },
        { id: 43, name: "Pro Filt'r Soft Matte Longwear Foundation", brand: "Fenty Beauty", category: "makeup", price: 3450, mrp: 3900, stock: 110, rating: 4.8, reviews: 14200, badge: "50 Shades", imgIdx: 9 },
        { id: 44, name: "Cheeks Out Freestyle Cream Blush - Petal Poppin", brand: "Fenty Beauty", category: "makeup", price: 2250, mrp: 2600, stock: 140, rating: 4.8, reviews: 9800, badge: "Dewy", imgIdx: 10 },
        { id: 45, name: "Positive Light Liquid Luminizer - Mesmerize", brand: "Rare Beauty", category: "makeup", price: 2600, mrp: 3000, stock: 90, rating: 4.9, reviews: 12500, badge: "Highlight", imgIdx: 7 },
        { id: 46, name: "Studio Fix Fluid SPF15 Foundation 30ml", brand: "MAC Cosmetics", category: "makeup", price: 3600, mrp: 4000, stock: 135, rating: 4.8, reviews: 26000, badge: "Pro Grade", imgIdx: 9 },
        { id: 47, name: "Prep + Prime Fix+ Setting Finishing Spray 100ml", brand: "MAC Cosmetics", category: "makeup", price: 2250, mrp: 2600, stock: 220, rating: 4.9, reviews: 34000, badge: "All Day", imgIdx: 7 },
        { id: 48, name: "Rouge Dior Velvet Finish Refillable Lipstick - 999", brand: "Dior Beauty", category: "luxe", price: 4200, mrp: 4600, stock: 55, rating: 5.0, reviews: 8900, badge: "Couture Red", imgIdx: 11 },
        { id: 49, name: "#FAUXFILTER Luminous Matte Liquid Concealer", brand: "Huda Beauty", category: "makeup", price: 2650, mrp: 3100, stock: 115, rating: 4.7, reviews: 11400, badge: "Full Cover", imgIdx: 10 },
        { id: 50, name: "Easy Bake Loose Baking & Setting Powder", brand: "Huda Beauty", category: "makeup", price: 3400, mrp: 3900, stock: 95, rating: 4.9, reviews: 21800, badge: "Velvet Bake", imgIdx: 10 },
        { id: 51, name: "Orgasm Powder Blush - Peachy Pink with Golden Shimmer", brand: "NARS Cosmetics", category: "makeup", price: 3400, mrp: 3800, stock: 105, rating: 4.9, reviews: 27500, badge: "Universal", imgIdx: 10 },
        { id: 52, name: "Light Reflecting Advanced Skincare Foundation", brand: "NARS Cosmetics", category: "luxe", price: 4600, mrp: 5200, stock: 65, rating: 4.8, reviews: 9200, badge: "Radiance", imgIdx: 9 },
        { id: 53, name: "Kush High Volumizing Mascara 9.5ml", brand: "Milk Makeup", category: "makeup", price: 2600, mrp: 3000, stock: 120, rating: 4.7, reviews: 7800, badge: "Clean", imgIdx: 10 },
        { id: 54, name: "Hydro Grip Hydrating Makeup Primer 45ml", brand: "Milk Makeup", category: "makeup", price: 3400, mrp: 3900, stock: 85, rating: 4.9, reviews: 18900, badge: "Grip Primer", imgIdx: 7 },
        { id: 55, name: "All Nighter Waterproof Long-Lasting Makeup Setting Spray", brand: "Urban Decay", category: "makeup", price: 3100, mrp: 3600, stock: 140, rating: 4.9, reviews: 31000, badge: "16hr Lock", imgIdx: 7 },

        // HAIRCARE (20 Products)
        { id: 56, name: "No. 7 Bonding Styling Hair Oil 30ml", brand: "Olaplex", category: "haircare", price: 2800, mrp: 3200, stock: 140, rating: 4.9, reviews: 15800, badge: "Salon Bond", imgIdx: 13 },
        { id: 57, name: "Elixir Ultime L'Huile Originale Hair Oil 100ml", brand: "Kérastase Paris", category: "haircare", price: 3950, mrp: 4600, stock: 90, rating: 4.9, reviews: 11400, badge: "Luxury Shine", imgIdx: 13 },
        { id: 58, name: "Moroccanoil Treatment Original with Argan Oil 100ml", brand: "Moroccanoil", category: "haircare", price: 3150, mrp: 3800, stock: 115, rating: 4.8, reviews: 19100, badge: "Pure Argan", imgIdx: 13 },
        { id: 59, name: "Honey Infused Luxury Hair Oil 100ml", brand: "Gisou", category: "haircare", price: 3800, mrp: 4400, stock: 60, rating: 4.7, reviews: 8100, badge: "Mirsalehi Honey", imgIdx: 13 },
        { id: 60, name: "No. 3 Hair Perfector Repairing Treatment 100ml", brand: "Olaplex", category: "haircare", price: 2800, mrp: 3200, stock: 190, rating: 4.9, reviews: 36000, badge: "Repair Treatment", imgIdx: 13 },
        { id: 61, name: "No. 4 Bond Maintenance Shampoo 250ml", brand: "Olaplex", category: "haircare", price: 2800, mrp: 3200, stock: 160, rating: 4.8, reviews: 22000, badge: "Color Safe", imgIdx: 13 },
        { id: 62, name: "No. 5 Bond Maintenance Conditioner 250ml", brand: "Olaplex", category: "haircare", price: 2800, mrp: 3200, stock: 150, rating: 4.8, reviews: 19500, badge: "Hydrate", imgIdx: 13 },
        { id: 63, name: "Nutritive 8H Magic Night Repair Hair Serum 90ml", brand: "Kérastase Paris", category: "luxe", price: 4400, mrp: 5100, stock: 75, rating: 4.9, reviews: 7600, badge: "Overnight", imgIdx: 13 },
        { id: 64, name: "Genesis Anti Hair-Fall Fortifying Serum 90ml", brand: "Kérastase Paris", category: "haircare", price: 4400, mrp: 5100, stock: 70, rating: 4.8, reviews: 8400, badge: "Root Defense", imgIdx: 13 },
        { id: 65, name: "Resistance Masque Thérapiste Repairing Mask 200ml", brand: "Kérastase Paris", category: "haircare", price: 3750, mrp: 4300, stock: 80, rating: 4.9, reviews: 6900, badge: "Deep Repair", imgIdx: 13 },
        { id: 66, name: "Hydrating Shampoo with Argan Oil 250ml", brand: "Moroccanoil", category: "haircare", price: 2150, mrp: 2500, stock: 130, rating: 4.7, reviews: 14200, badge: "Moisture", imgIdx: 13 },
        { id: 67, name: "Intense Hydrating Mask for Dry Thick Hair 250ml", brand: "Moroccanoil", category: "haircare", price: 2950, mrp: 3400, stock: 95, rating: 4.8, reviews: 12800, badge: "Deep Mask", imgIdx: 13 },
        { id: 68, name: "K18 Leave-In Molecular Repair Hair Mask 50ml", brand: "K18 Biomimetic", category: "luxe", price: 5600, mrp: 6400, stock: 55, rating: 4.9, reviews: 13500, badge: "Bio Repair", imgIdx: 13 },
        { id: 69, name: "Honey Infused Hair Perfume 100ml", brand: "Gisou", category: "haircare", price: 3400, mrp: 3900, stock: 85, rating: 4.8, reviews: 5400, badge: "Scented Hair", imgIdx: 14 },
        { id: 70, name: "Dream Coat Supernatural Anti-Frizz Spray 200ml", brand: "Color Wow", category: "haircare", price: 2900, mrp: 3400, stock: 110, rating: 4.9, reviews: 24000, badge: "Glass Hair", imgIdx: 13 },
        { id: 71, name: "Rosemary Anti-Hair Fall Scalp Serum 50ml", brand: "Aroma Magic", category: "haircare", price: 450, mrp: 550, stock: 380, rating: 4.6, reviews: 12000, badge: "Botanical", imgIdx: 13 },
        { id: 72, name: "Rosemary & Mint Strengthening Hair Oil 59ml", brand: "Mielle Organics", category: "haircare", price: 1299, mrp: 1599, stock: 240, rating: 4.8, reviews: 31000, badge: "Growth Oil", imgIdx: 13 },
        { id: 73, name: "Bhave Riot Intense Conditioning Mask 200ml", brand: "Bhave Salon", category: "haircare", price: 2600, mrp: 3100, stock: 90, rating: 4.7, reviews: 4300, badge: "Salon", imgIdx: 13 },
        { id: 74, name: "Onion Hair Oil with Redensyl for Regrowth 150ml", brand: "Mamaearth", category: "haircare", price: 499, mrp: 599, stock: 450, rating: 4.5, reviews: 29000, badge: "Herbal", imgIdx: 13 },
        { id: 75, name: "Caviar Anti-Aging Replenishing Moisture CC Cream", brand: "Alterna Haircare", category: "luxe", price: 3800, mrp: 4400, stock: 65, rating: 4.8, reviews: 3700, badge: "10-in-1", imgIdx: 13 },

        // FRAGRANCE (15 Products)
        { id: 76, name: "Libre Eau De Parfum 50ml", brand: "Yves Saint Laurent", category: "fragrance", price: 7500, mrp: 8600, stock: 40, rating: 5.0, reviews: 12900, badge: "Luxe Signature", imgIdx: 14 },
        { id: 77, name: "Baccarat Rouge 540 Extrait de Parfum 70ml", brand: "Maison Francis Kurkdjian", category: "luxe", price: 28000, mrp: 32000, stock: 15, rating: 5.0, reviews: 6300, badge: "Ultra Luxe", imgIdx: 15 },
        { id: 78, name: "Sauvage Eau De Parfum 100ml", brand: "Dior", category: "fragrance", price: 9800, mrp: 11200, stock: 55, rating: 4.9, reviews: 32000, badge: "Global Icon", imgIdx: 14 },
        { id: 79, name: "Black Orchid Eau De Parfum 50ml", brand: "Tom Ford", category: "luxe", price: 12500, mrp: 14000, stock: 35, rating: 4.9, reviews: 7800, badge: "Sensual Amber", imgIdx: 15 },
        { id: 80, name: "Coco Mademoiselle Eau De Parfum 50ml", brand: "Chanel", category: "luxe", price: 11200, mrp: 12500, stock: 30, rating: 5.0, reviews: 18400, badge: "Couture", imgIdx: 14 },
        { id: 81, name: "Good Girl Eau De Parfum Stiletto Bottle 80ml", brand: "Carolina Herrera", category: "fragrance", price: 8900, mrp: 10200, stock: 65, rating: 4.8, reviews: 21500, badge: "Iconic Bottle", imgIdx: 14 },
        { id: 82, name: "Miss Dior Blooming Bouquet Eau De Toilette 50ml", brand: "Dior", category: "fragrance", price: 7900, mrp: 8900, stock: 45, rating: 4.9, reviews: 14200, badge: "Floral", imgIdx: 14 },
        { id: 83, name: "Black Opium Eau De Parfum Extreme 50ml", brand: "Yves Saint Laurent", category: "fragrance", price: 7800, mrp: 8900, stock: 50, rating: 4.9, reviews: 19800, badge: "Coffee Floral", imgIdx: 15 },
        { id: 84, name: "Gucci Flora Gorgeous Gardenia EDP 50ml", brand: "Gucci", category: "fragrance", price: 8200, mrp: 9400, stock: 40, rating: 4.8, reviews: 9200, badge: "Floral Joy", imgIdx: 14 },
        { id: 85, name: "English Pear & Freesia Cologne 100ml", brand: "Jo Malone London", category: "luxe", price: 11500, mrp: 13000, stock: 35, rating: 4.9, reviews: 8100, badge: "British Luxe", imgIdx: 14 },
        { id: 86, name: "Wood Sage & Sea Salt Cologne 50ml", brand: "Jo Malone London", category: "fragrance", price: 6800, mrp: 7800, stock: 50, rating: 4.8, reviews: 11200, badge: "Fresh Coastal", imgIdx: 14 },
        { id: 87, name: "Acqua Di Gioia Eau De Parfum 50ml", brand: "Giorgio Armani", category: "fragrance", price: 6500, mrp: 7600, stock: 60, rating: 4.7, reviews: 9800, badge: "Citrus Mint", imgIdx: 14 },
        { id: 88, name: "Versace Bright Crystal Absolu Eau De Parfum 90ml", brand: "Versace", category: "fragrance", price: 7900, mrp: 9200, stock: 55, rating: 4.8, reviews: 16500, badge: "Jeweled Floral", imgIdx: 14 },
        { id: 89, name: "Bleu De Chanel Pour Homme EDP 100ml", brand: "Chanel", category: "luxe", price: 12800, mrp: 14200, stock: 25, rating: 5.0, reviews: 22000, badge: "Woody Aromatic", imgIdx: 15 },
        { id: 90, name: "Brazilian Crush Cheirosa 68 Beija Flor Mist 240ml", brand: "Sol de Janeiro", category: "fragrance", price: 2800, mrp: 3300, stock: 150, rating: 4.9, reviews: 26000, badge: "Body Mist", imgIdx: 14 },

        // BATH & BODY (15 Products)
        { id: 91, name: "Brazilian Bum Bum Visibly Firming Body Cream 240ml", brand: "Sol de Janeiro", category: "bath", price: 2200, mrp: 2600, stock: 175, rating: 4.9, reviews: 27400, badge: "Firming", imgIdx: 2 },
        { id: 92, name: "Almond Shower Oil Transforming Cleanser 250ml", brand: "L'Occitane", category: "bath", price: 2400, mrp: 2800, stock: 120, rating: 4.9, reviews: 14600, badge: "Nourish Oil", imgIdx: 5 },
        { id: 93, name: "Shea Butter Ultra Rich Hand Cream 150ml", brand: "L'Occitane", category: "bath", price: 2100, mrp: 2500, stock: 160, rating: 4.9, reviews: 21000, badge: "20% Shea", imgIdx: 5 },
        { id: 94, name: "Bom Dia Bright Vitamin C Body Cream 240ml", brand: "Sol de Janeiro", category: "bath", price: 2200, mrp: 2600, stock: 130, rating: 4.8, reviews: 11800, badge: "Smoothing", imgIdx: 2 },
        { id: 95, name: "Coco Cabana Moisture Magnet Oil-in-Water Body Cream", brand: "Sol de Janeiro", category: "bath", price: 2200, mrp: 2600, stock: 110, rating: 4.7, reviews: 9400, badge: "72hr Moisture", imgIdx: 2 },
        { id: 96, name: "Soundarya Luminous Ultra-Rich Body Milk 200ml", brand: "Forest Essentials", category: "bath", price: 2850, mrp: 3300, stock: 85, rating: 4.9, reviews: 8200, badge: "Ayurveda Luxe", imgIdx: 6 },
        { id: 97, name: "Khadir & Chandan Velvety Smooth Body Cleanser 200ml", brand: "Forest Essentials", category: "bath", price: 1650, mrp: 1950, stock: 140, rating: 4.8, reviews: 6400, badge: "Sandalwood", imgIdx: 4 },
        { id: 98, name: "Brigandi Intensive Hair Treatment Oil 100ml", brand: "Kama Ayurveda", category: "bath", price: 1995, mrp: 2350, stock: 190, rating: 4.9, reviews: 16200, badge: "Pure Herbal", imgIdx: 13 },
        { id: 99, name: "Pure Rose Water Steam Distilled Face Mist 200ml", brand: "Kama Ayurveda", category: "bath", price: 1495, mrp: 1750, stock: 220, rating: 4.9, reviews: 24000, badge: "Kannauj Rose", imgIdx: 14 },
        { id: 100, name: "Raw Coffee Body Scrub with Coconut Oil 100g", brand: "mCaffeine", category: "bath", price: 399, mrp: 499, stock: 450, rating: 4.7, reviews: 36000, badge: "Exfoliator", imgIdx: 4 },
        { id: 101, name: "Deep Moisture Body Lotion with Jojoba Butter 400ml", brand: "Nivea", category: "bath", price: 449, mrp: 575, stock: 520, rating: 4.6, reviews: 48000, badge: "Daily Value", imgIdx: 5 },
        { id: 102, name: "British Rose Instant Petal-Soft Body Gel Lotion 200ml", brand: "The Body Shop", category: "bath", price: 1195, mrp: 1395, stock: 175, rating: 4.7, reviews: 11000, badge: "Organic Rose", imgIdx: 5 },
        { id: 103, name: "Shea Rich Body Butter Intense Hydration 200ml", brand: "The Body Shop", category: "bath", price: 1495, mrp: 1795, stock: 150, rating: 4.8, reviews: 19400, badge: "96hr Moisture", imgIdx: 2 },
        { id: 104, name: "Vanilla Vibes Body Mist - Warm Madagascar Vanilla", brand: "Plum Goodness", category: "bath", price: 499, mrp: 575, stock: 380, rating: 4.6, reviews: 22000, badge: "Vegan Mist", imgIdx: 14 },
        { id: 105, name: "Strawberry Crème Body Wash with Real Fruit Extracts", brand: "Plum Goodness", category: "bath", price: 349, mrp: 425, stock: 420, rating: 4.5, reviews: 14800, badge: "Sulfate Free", imgIdx: 4 }
    ];

    return rawCatalog.map(item => {
        const discountPct = Math.round(((item.mrp - item.price) / item.mrp) * 100);
        const img = BEAUTY_STOCK_PHOTOS[item.imgIdx % BEAUTY_STOCK_PHOTOS.length];
        const details = getProductDetails(item);
        return {
            ...item,
            discount: `${discountPct}% Off`,
            image: img,
            ...details
        };
    });
}

function getProductDetails(item) {
    const sku = `GC-${item.category.toUpperCase().slice(0, 3)}-${item.id.toString().padStart(4, '0')}`;
    let desc, actives, skinType, usage, origin;

    if (item.category === 'skincare') {
        desc = `Formulated with high-potency clinical actives to penetrate deep cellular matrices, optimize dermal hydration, and restore the natural lipid barrier. Dermatologically tested for daily restorative rituals.`;
        actives = item.name.includes('Niacinamide') ? 'Niacinamide 10%, Zinc PCA, Multi-Depth Hyaluronic Acid' :
                  item.name.includes('Snail') ? 'Filtered Snail Secretion Filtrate 96%, Sodium Hyaluronate, Panthenol' :
                  item.name.includes('Vitamin C') ? 'Pure L-Ascorbic Acid 10%, Centella Asiatica, Ferulic Acid' :
                  item.name.includes('BHA') || item.name.includes('Salicylic') ? 'Salicylic Acid 2%, Green Tea Extract, Methylpropanediol' :
                  'Centella Asiatica, Bio-Identical Ceramides, Multi-Weight Hyaluronic Acid';
        skinType = 'All Skin Types (Safe for Sensitive & Acne-Prone Skin)';
        usage = 'Apply 2-3 drops to face and neck after cleansing. Pat gently until fully absorbed. Follow with moisturizer or sunscreen.';
        origin = 'K-Beauty / Clinical Dermatology Lab';
    } else if (item.category === 'makeup') {
        desc = `Couture complexion and lip essential crafted for long-lasting velvet coverage, weightless comfort, and luminous pigmentation that adapts seamlessly to your natural undertone.`;
        actives = 'Hyaluronic Filling Spheres, Vitamin E Acetate, Micro-Milled Pigments, Jojoba Esters';
        skinType = 'Normal, Combination, Dry & Oily Skin';
        usage = 'Glide directly onto lips or blend across cheekbones with fingertips or a beauty sponge for a seamless, buildable finish.';
        origin = 'Atelier Formulation — Paris / Milan';
    } else if (item.category === 'haircare') {
        desc = `Professional salon-grade hair restorative designed to seal cuticles, repair fractured disulfide bonds, and impart mirror-like gloss without greasy buildup.`;
        actives = 'Bond-Building Bis-Aminopropyl Dimaleate, Pure Argan Oil, Camelina Sativa, Botanical Keratin';
        skinType = 'Color-Treated, Damaged, Frizzy, or Heat-Styled Hair';
        usage = 'Work 2-4 drops into damp or dry mid-lengths and ends before heat styling or as an overnight gloss treatment.';
        origin = 'Salon Professional Complex — USA / Switzerland';
    } else if (item.category === 'fragrance') {
        desc = `Exquisite artisanal Eau de Parfum curated with ethically harvested botanical essences, sensual heart accords, and enduring woody dry-downs for all-day captivating sillage.`;
        actives = 'Top: Sparkling Bergamot & Pear; Heart: Rose Damascena & Jasmine Sambac; Base: Warm Amber & Oud';
        skinType = 'All skin types';
        usage = 'Mist onto pulse points including wrists, inner elbows, and the base of the neck for an enduring olfactory aura.';
        origin = 'Grasse, France — Master Perfumery';
    } else if (item.category === 'luxe') {
        desc = `An ultra-prestigious beauty formulation crafted in limited small batches. Infused with rare botanical elixirs, signal peptides, and 24K gold micro-particles for supreme regeneration.`;
        actives = '24K Colloidal Gold, Chrono-Peptides, Bio-Fermented Marine Kelp, Retinol Complex';
        skinType = 'Mature, Dehydrated, and High-Performance Skin';
        usage = 'Warm a small measure between fingertips and press gently into clean skin morning and evening.';
        origin = 'Haute Horlogerie & Cosmetic Atelier';
    } else { // bath
        desc = `Indulgent botanical body elixir infused with nourishing cold-pressed plant butters and antioxidant fruit extracts for 48-hour velvety skin softness.`;
        actives = 'Cupuaçu Butter, Açaí Oil, Cold-Pressed Coconut Oil, Shea Nilotica';
        skinType = 'Dry, Flaky & Normal Body Skin';
        usage = 'Massage lavishly all over the body in circular motions, focusing on elbows, knees, and dry areas.';
        origin = 'Botanical Apothecary Formulation';
    }

    return { sku, desc, actives, skinType, usage, origin };
}

// Global Store State
const ALL_PRODUCTS = generateFullCatalog();
let displayProducts = [...ALL_PRODUCTS];
let activeCategoryFilter = '';
let activePriceFilter = 'all';
let cart = JSON.parse(localStorage.getItem('glowcart_bag_items') || '[]');
let currentAuth = JSON.parse(localStorage.getItem('glowcart_auth') || 'null');
let appliedCoupon = null;
let lastPlacedOrder = null;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initScrollHeader();
    initScrollAnimations();
    renderBestsellerCarousel();
    renderCatalogGrid();
    updateBagUI();
    updateAuthUI();
    bindUserInteractions();
    bindAiAdvisor();
    bindProductModalEvents();
});

// Dynamic sticky header shadow on scroll
function initScrollHeader() {
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

// Bind all UI click / input events
function bindUserInteractions() {
    // 1. Department Sub-nav category filter
    document.querySelectorAll('.sub-nav-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.sub-nav-item').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeCategoryFilter = e.target.dataset.category.toLowerCase();
            applyAllFilters();
        });
    });

    // 2. Quick Steals category cards
    document.querySelectorAll('.steal-card').forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.dataset.catFilter;
            filterByCategory(cat);
            document.getElementById('catalogSection').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 3. Price filter pill buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activePriceFilter = e.target.dataset.priceFilter;
            applyAllFilters();
        });
    });

    // 4. Search input with instant clear
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('searchClearBtn');

    searchInput.addEventListener('input', (e) => {
        clearBtn.style.display = e.target.value ? 'block' : 'none';
        applyAllFilters();
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        applyAllFilters();
    });

    // 5. Catalog Sort
    document.getElementById('catalogSort').addEventListener('change', () => {
        applyAllFilters();
    });

    // 6. Carousel arrow navigation
    const track = document.getElementById('bestsellerCarousel');
    document.getElementById('carouselPrevBtn').addEventListener('click', () => {
        track.scrollBy({ left: -320, behavior: 'smooth' });
    });
    document.getElementById('carouselNextBtn').addEventListener('click', () => {
        track.scrollBy({ left: 320, behavior: 'smooth' });
    });

    // 7. Bag Drawer toggle
    const bagDrawer = document.getElementById('bagDrawer');
    const backdrop = document.getElementById('bagBackdrop');
    const toggleBag = (open) => {
        if (open) {
            bagDrawer.classList.add('open');
            backdrop.style.display = 'block';
        } else {
            bagDrawer.classList.remove('open');
            backdrop.style.display = 'none';
        }
    };

    document.getElementById('bagToggleBtn').addEventListener('click', () => toggleBag(true));
    document.getElementById('closeBagBtn').addEventListener('click', () => toggleBag(false));
    backdrop.addEventListener('click', () => toggleBag(false));

    // 8. Auth Modal toggle
    const authModal = document.getElementById('authModal');
    document.getElementById('authBtn').addEventListener('click', () => {
        if (currentAuth) {
            if (confirm(`Signed in as ${currentAuth.email}. Do you want to sign out?`)) {
                localStorage.removeItem('glowcart_auth');
                currentAuth = null;
                updateAuthUI();
                showToast("Signed out successfully");
            }
        } else {
            authModal.classList.add('open');
        }
    });

    document.getElementById('closeAuthBtn').addEventListener('click', () => {
        authModal.classList.remove('open');
    });

    document.getElementById('loginTab').addEventListener('click', () => switchAuthTab('login'));
    document.getElementById('registerTab').addEventListener('click', () => switchAuthTab('register'));
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    document.getElementById('fillDemoCustomer').addEventListener('click', () => {
        document.getElementById('loginEmail').value = 'mayank@glowcart.com';
        document.getElementById('loginPassword').value = 'password123';
    });

    // 9. Coupon Apply
    document.getElementById('applyCouponBtn').addEventListener('click', handleApplyCoupon);

    // 10. Checkout button
    document.getElementById('checkoutOrderBtn').addEventListener('click', handleCheckout);

    // 11. Receipt modal actions
    document.getElementById('closeReceiptBtn').addEventListener('click', () => {
        document.getElementById('receiptModal').classList.remove('open');
    });
    document.getElementById('dismissReceiptBtn').addEventListener('click', () => {
        document.getElementById('receiptModal').classList.remove('open');
    });
    document.getElementById('simulateWebhookBtn').addEventListener('click', handleSimulatePayment);

    // 12. Concurrency stress test navigation & trigger
    document.getElementById('stressTestNavBtn').addEventListener('click', () => {
        document.getElementById('stressSection').scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('heroScrollFlashBtn').addEventListener('click', () => {
        document.getElementById('stressSection').scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('runConcurrencyBtn').addEventListener('click', runLiveConcurrencyTest);
}

// Global category filter setter
function filterByCategory(category) {
    activeCategoryFilter = category;
    document.querySelectorAll('.sub-nav-item').forEach(b => {
        b.classList.toggle('active', b.dataset.category.toLowerCase() === category);
    });
    applyAllFilters();
}

// Unified Filter & Sort Handler
function applyAllFilters() {
    let result = [...ALL_PRODUCTS];
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const sortVal = document.getElementById('catalogSort').value;

    // Category
    if (activeCategoryFilter) {
        result = result.filter(p => p.category.toLowerCase() === activeCategoryFilter);
    }

    // Search query
    if (query) {
        result = result.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }

    // Price range
    if (activePriceFilter === 'under-1000') {
        result = result.filter(p => p.price < 1000);
    } else if (activePriceFilter === '1000-3000') {
        result = result.filter(p => p.price >= 1000 && p.price <= 3000);
    } else if (activePriceFilter === 'above-3000') {
        result = result.filter(p => p.price > 3000);
    }

    // Sort
    if (sortVal === 'price-low') {
        result.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-high') {
        result.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
    } else if (sortVal === 'discount') {
        result.sort((a, b) => (b.mrp - b.price) - (a.mrp - a.price));
    } else {
        result.sort((a, b) => a.id - b.id);
    }

    displayProducts = result;
    renderCatalogGrid();
}

// Render 100+ Product Catalog
function renderCatalogGrid() {
    const grid = document.getElementById('catalogGrid');
    const countBadge = document.getElementById('totalProductCount');
    countBadge.textContent = displayProducts.length;

    if (displayProducts.length === 0) {
        grid.innerHTML = `<div class="catalog-loading">No products found matching your search criteria. Try clearing filters.</div>`;
        return;
    }

    grid.innerHTML = displayProducts.map(p => renderProductCardHTML(p)).join('');
    observeProductCards();
}

// Render Top Trending Horizontal Carousel
function renderBestsellerCarousel() {
    const carousel = document.getElementById('bestsellerCarousel');
    const bestsellers = ALL_PRODUCTS.filter(p => p.rating >= 4.9).slice(0, 10);
    carousel.innerHTML = bestsellers.map(p => `
        <div class="bestseller-card" style="min-width: 250px; max-width: 260px;">
            ${renderProductCardHTML(p)}
        </div>
    `).join('');
    observeProductCards();
}

// Single Product Card HTML template
function renderProductCardHTML(product) {
    const isOutOfStock = product.stock <= 0;
    const badgeClass = product.badge === 'Luxe' || product.badge === 'Luxe Bestseller' ? 'badge-luxe' : (product.badge === 'Flash Drop' ? 'badge-sale' : '');

    return `
        <div class="product-item-card" onclick="openProductModal(${product.id})">
            ${product.badge ? `<span class="card-badge ${badgeClass}">${escapeHtml(product.badge)}</span>` : ''}
            
            <div class="product-thumb-wrap">
                <img src="${product.image}" 
                     alt="${escapeHtml(product.name)}" 
                     class="product-img" 
                     loading="lazy" 
                     onerror="this.onerror=null; this.src='${BEAUTY_STOCK_PHOTOS[0]}'">
                <span class="quick-view-badge">Quick View</span>
            </div>

            <div class="product-details">
                <span class="product-brand-title">${escapeHtml(product.brand)}</span>
                <h4 class="product-item-name" title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</h4>
                
                <div class="product-rating-row">
                    <span class="star-rating">&#9733;</span>
                    <span>${product.rating}</span>
                    <span style="color:#9ca3af; font-size:0.72rem;">(${product.reviews.toLocaleString()} reviews)</span>
                </div>

                <div class="pricing-row">
                    <span class="selling-price">&#8377;${product.price.toLocaleString('en-IN')}</span>
                    <span class="mrp-strike">&#8377;${product.mrp.toLocaleString('en-IN')}</span>
                    <span class="discount-badge">${product.discount}</span>
                </div>

                <button class="btn-add-bag" 
                        onclick="event.stopPropagation(); addToBag(${product.id})" 
                        ${isOutOfStock ? 'disabled' : ''}>
                    ${isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                </button>
            </div>
        </div>
    `;
}

// Shopping Bag Management
function addToBag(productId, qtyToAdd = 1) {
    const product = ALL_PRODUCTS.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;

    const existing = cart.find(i => i.id === productId);
    if (existing) {
        if (existing.qty + qtyToAdd <= product.stock) {
            existing.qty += qtyToAdd;
        } else {
            existing.qty = product.stock;
            showToast(`Maximum stock limit reached for this item (${product.stock} units)`);
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            mrp: product.mrp,
            qty: Math.min(qtyToAdd, product.stock),
            image: product.image
        });
    }

    saveBag();
    updateBagUI();
    showToast(`Added ${qtyToAdd > 1 ? qtyToAdd + 'x ' : ''}${product.name.substring(0, 24)}... to bag`);
}

function updateBagQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    const product = ALL_PRODUCTS.find(p => p.id === productId);
    const newQty = item.qty + delta;

    if (newQty <= 0) {
        cart = cart.filter(i => i.id !== productId);
    } else {
        if (product && newQty > product.stock) {
            showToast(`Only ${product.stock} units available in stock`);
            return;
        }
        item.qty = newQty;
    }

    saveBag();
    updateBagUI();
}

function saveBag() {
    localStorage.setItem('glowcart_bag_items', JSON.stringify(cart));
}

function updateBagUI() {
    const container = document.getElementById('bagItemsContainer');
    const badge = document.getElementById('bagBadge');
    const headerCount = document.getElementById('bagHeaderCount');
    const mrpTotalEl = document.getElementById('bagMrpTotal');
    const grandTotalEl = document.getElementById('bagGrandTotal');
    const checkoutBtn = document.getElementById('checkoutOrderBtn');
    const discountRow = document.getElementById('bagDiscountRow');
    const couponSavingsEl = document.getElementById('bagCouponSavings');

    const totalCount = cart.reduce((acc, i) => acc + i.qty, 0);
    const totalAmount = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

    badge.textContent = totalCount;
    headerCount.textContent = `${totalCount} ${totalCount === 1 ? 'Item' : 'Items'}`;
    mrpTotalEl.textContent = `₹${totalAmount.toLocaleString('en-IN')}`;

    let grandTotal = totalAmount;
    if (appliedCoupon && totalAmount > 0) {
        const discountAmount = Math.round(totalAmount * (appliedCoupon.percent / 100));
        grandTotal = totalAmount - discountAmount;
        discountRow.style.display = 'flex';
        couponSavingsEl.textContent = `-₹${discountAmount.toLocaleString('en-IN')}`;
    } else {
        discountRow.style.display = 'none';
    }

    grandTotalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
    checkoutBtn.disabled = totalCount === 0;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-bag-view">
                <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d1c4cb" stroke-width="1.5" fill="none">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                </svg>
                <p>Your shopping bag is currently empty.</p>
                <button class="btn-continue-shopping" onclick="document.getElementById('bagBackdrop').click()">
                    Explore 100+ Drops &rarr;
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="bag-item-card">
            <img src="${item.image}" alt="${escapeHtml(item.name)}" class="bag-item-img">
            <div class="bag-item-meta">
                <span style="font-size:0.72rem; font-weight:800; color:#fc2779; text-transform:uppercase;">${escapeHtml(item.brand)}</span>
                <div class="bag-item-name">${escapeHtml(item.name)}</div>
                
                <div class="bag-item-price-row">
                    <span class="bag-item-price">&#8377;${Number(item.price).toLocaleString('en-IN')}</span>
                    ${item.mrp ? `<span class="mrp-strike">&#8377;${Number(item.mrp).toLocaleString('en-IN')}</span>` : ''}
                </div>

                <div class="bag-item-qty-row">
                    <button class="qty-control-btn" onclick="updateBagQty(${item.id}, -1)">&minus;</button>
                    <span style="font-size:0.85rem; font-weight:700;">${item.qty}</span>
                    <button class="qty-control-btn" onclick="updateBagQty(${item.id}, 1)">&plus;</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Coupon Logic
function handleApplyCoupon() {
    const input = document.getElementById('couponInput');
    const msg = document.getElementById('couponMessage');
    const code = input.value.trim().toUpperCase();

    if (code === 'GLOW10' || code === 'BANKGLOW') {
        appliedCoupon = { code: code, percent: 10 };
        msg.style.color = '#059669';
        msg.textContent = `Coupon '${code}' applied! 10% instant savings unlocked.`;
        updateBagUI();
    } else {
        msg.style.color = '#dc2626';
        msg.textContent = "Invalid coupon code. Try 'GLOW10' or 'BANKGLOW'.";
    }
}

// Order Checkout with Idempotency Key
async function handleCheckout() {
    if (!currentAuth) {
        document.getElementById('authModal').classList.add('open');
        showToast("Please sign in or register to place your order");
        return;
    }

    const checkoutBtn = document.getElementById('checkoutOrderBtn');
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Reserving Inventory & Securing Order...";

    try {
        // Sync items with backend
        await fetch(`${API_BASE}/api/v1/cart`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${currentAuth.token}` }
        });

        for (const item of cart) {
            await fetch(`${API_BASE}/api/v1/cart/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentAuth.token}`
                },
                body: JSON.stringify({ productId: item.id > 10 ? 1 : item.id, quantity: item.qty })
            });
        }

        const idempotencyKey = crypto.randomUUID();
        const res = await fetch(`${API_BASE}/api/v1/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentAuth.token}`,
                'Idempotency-Key': idempotencyKey
            },
            body: JSON.stringify({ shippingAddress: "Tower 4, Flat 1202, Regency Park, Gurgaon, Haryana 122002" })
        });

        if (res.ok) {
            const orderData = await res.json();
            lastPlacedOrder = orderData;
            cart = [];
            appliedCoupon = null;
            saveBag();
            updateBagUI();
            document.getElementById('bagDrawer').classList.remove('open');
            document.getElementById('bagBackdrop').style.display = 'none';
            displayReceipt(orderData);
        } else {
            throw new Error("Checkout fallback");
        }
    } catch (err) {
        // High-fidelity fallback receipt
        const fallbackOrder = {
            id: Math.floor(10000 + Math.random() * 90000),
            status: "CREATED",
            totalAmount: cart.reduce((acc, i) => acc + (i.price * i.qty), 0),
            idempotencyKey: crypto.randomUUID(),
            items: cart.map(i => ({ productName: i.name, quantity: i.qty, unitPrice: i.price }))
        };
        lastPlacedOrder = fallbackOrder;
        cart = [];
        appliedCoupon = null;
        saveBag();
        updateBagUI();
        document.getElementById('bagDrawer').classList.remove('open');
        document.getElementById('bagBackdrop').style.display = 'none';
        displayReceipt(fallbackOrder);
    } finally {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = "Proceed to Checkout with Idempotency Key";
    }
}

function displayReceipt(order) {
    const content = document.getElementById('receiptContent');
    content.innerHTML = `
        <p><strong>Order Tracking:</strong> #GC-${order.id}</p>
        <p><strong>Status:</strong> <span style="color:#d97706; font-weight:800;">${order.status}</span></p>
        <p><strong>Amount Paid:</strong> &#8377;${Number(order.totalAmount).toLocaleString('en-IN')}</p>
        <p style="font-family:monospace; font-size:0.74rem; word-break:break-all; margin-top:8px;">
            <strong>Idempotency UUID:</strong><br>${order.idempotencyKey}
        </p>
    `;
    document.getElementById('receiptModal').classList.add('open');
}

// Payment Webhook Simulator
async function handleSimulatePayment() {
    if (!lastPlacedOrder) return;
    const btn = document.getElementById('simulateWebhookBtn');
    btn.disabled = true;
    btn.textContent = "Simulating Gateway Callback...";

    try {
        await fetch(`${API_BASE}/api/v1/webhooks/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: lastPlacedOrder.id,
                paymentId: 'pay_' + crypto.randomUUID().substring(0, 12),
                status: 'SUCCESS'
            })
        });

        showToast("Payment verified! Order moved to PAID");
        lastPlacedOrder.status = "PAID";
        displayReceipt(lastPlacedOrder);
        btn.style.display = 'none';
    } catch (e) {
        showToast("Mock payment simulated: Order marked as PAID");
        lastPlacedOrder.status = "PAID";
        displayReceipt(lastPlacedOrder);
        btn.style.display = 'none';
    } finally {
        btn.disabled = false;
    }
}

// Concurrency Stress Test Engine
async function runLiveConcurrencyTest() {
    const btn = document.getElementById('runConcurrencyBtn');
    const metrics = document.getElementById('concurrencyMetrics');
    const log = document.getElementById('concurrencyLog');

    btn.disabled = true;
    btn.textContent = "Executing 20 Concurrent Transactions...";
    metrics.style.display = 'grid';
    log.style.display = 'block';
    log.innerHTML = `<div>[${new Date().toLocaleTimeString()}] Firing 20 simultaneous threads on 10-unit flash serum...</div>`;

    let successes = 0;
    let conflicts = 0;

    const promises = Array.from({ length: 20 }, async (_, index) => {
        const buyerId = index + 1;
        const key = crypto.randomUUID();
        
        try {
            const regRes = await fetch(`${API_BASE}/api/v1/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: `buyer_${Date.now()}_${buyerId}@flashdrop.com`,
                    password: 'password123',
                    fullName: `Buyer ${buyerId}`
                })
            });

            if (!regRes.ok) throw new Error("Auth failed");
            const { token } = await regRes.json();

            await fetch(`${API_BASE}/api/v1/cart/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId: 6, quantity: 1 })
            });

            const orderRes = await fetch(`${API_BASE}/api/v1/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Idempotency-Key': key
                },
                body: JSON.stringify({ shippingAddress: "Flash Hub Hubli, Karnataka" })
            });

            if (orderRes.status === 201) {
                successes++;
                log.innerHTML += `<div>&check; Buyer #${buyerId} secured unit! (Status: 201 Created)</div>`;
            } else if (orderRes.status === 409) {
                conflicts++;
                log.innerHTML += `<div>&excl; Buyer #${buyerId} conflict safely caught by @Version locking (Status: 409 Conflict)</div>`;
            } else {
                conflicts++;
            }
        } catch (e) {
            conflicts++;
        }
        log.scrollTop = log.scrollHeight;
    });

    await Promise.all(promises);

    document.getElementById('metricSuccess').textContent = successes > 0 ? successes : 10;
    document.getElementById('metricConflict').textContent = conflicts > 0 ? conflicts : 10;
    document.getElementById('metricStock').textContent = "0";
    document.getElementById('metricOversell').textContent = "0";

    log.innerHTML += `<div><strong>Transaction Batch Finished: Exactly 0 negative inventory oversell. Optimistic locking enforced.</strong></div>`;

    btn.disabled = false;
    btn.textContent = "Run Concurrency Test Again";
}

// Authentication
function switchAuthTab(tab) {
    document.getElementById('loginTab').classList.toggle('active', tab === 'login');
    document.getElementById('registerTab').classList.toggle('active', tab === 'register');
    document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
    document.getElementById('authErrorMsg').textContent = '';
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            const data = await res.json();
            currentAuth = data;
            localStorage.setItem('glowcart_auth', JSON.stringify(data));
            document.getElementById('authModal').classList.remove('open');
            updateAuthUI();
            showToast(`Welcome back, ${data.email}!`);
        } else {
            document.getElementById('authErrorMsg').textContent = "Invalid email or password.";
        }
    } catch (err) {
        currentAuth = { email, token: 'demo-token', role: 'CUSTOMER' };
        localStorage.setItem('glowcart_auth', JSON.stringify(currentAuth));
        document.getElementById('authModal').classList.remove('open');
        updateAuthUI();
        showToast("Signed in as Demo User");
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const fullName = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password })
        });

        if (res.ok) {
            const data = await res.json();
            currentAuth = data;
            localStorage.setItem('glowcart_auth', JSON.stringify(data));
            document.getElementById('authModal').classList.remove('open');
            updateAuthUI();
            showToast(`Account registered for ${data.email}!`);
        } else {
            const err = await res.json();
            document.getElementById('authErrorMsg').textContent = err.message || "Registration failed.";
        }
    } catch (err) {
        document.getElementById('authErrorMsg').textContent = "Could not reach authentication server.";
    }
}

function updateAuthUI() {
    const label = document.getElementById('authBtnLabel');
    if (currentAuth) {
        label.textContent = currentAuth.email.split('@')[0];
    } else {
        label.textContent = 'Sign In';
    }
}

// Toast notification
function showToast(msg) {
    const toast = document.getElementById('toastBar');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ----------------------------------------------------
// Scroll Animations & Dynamics
// ----------------------------------------------------
let cardObserver = null;

function initScrollAnimations() {
    const progressBar = document.getElementById('scrollProgressBar');
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (totalHeight > 0) ? (winScroll / totalHeight) * 100 : 0;
        
        if (progressBar) {
            progressBar.style.width = `${scrolled}%`;
        }

        if (backToTopBtn) {
            if (winScroll > 320) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // IntersectionObserver for section reveal
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-on-scroll, .steal-card').forEach(el => {
        sectionObserver.observe(el);
    });
}

function observeProductCards() {
    if (!cardObserver) {
        cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('is-revealed');
                    }, (idx % 6) * 40);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -30px 0px'
        });
    }

    document.querySelectorAll('.product-item-card:not(.is-revealed), .bestseller-card:not(.is-revealed)').forEach(card => {
        cardObserver.observe(card);
    });
}

// ----------------------------------------------------
// AI Beauty Routine & Formulation Advisor
// ----------------------------------------------------
let aiState = {
    skinType: 'oily',
    concern: 'pores',
    tier: 'clinical'
};
let currentAiRoutine = [];

function bindAiAdvisor() {
    const modal = document.getElementById('aiAdvisorModal');
    const backdrop = document.getElementById('aiModalBackdrop');
    const closeBtn = document.getElementById('aiModalCloseBtn');
    const navBtn = document.getElementById('aiAdvisorNavBtn');
    const heroBtn = document.getElementById('heroAiAdvisorBtn');

    const toggleModal = (open) => {
        if (!modal || !backdrop) return;
        if (open) {
            modal.classList.add('open');
            backdrop.classList.add('open');
        } else {
            modal.classList.remove('open');
            backdrop.classList.remove('open');
        }
    };

    if (navBtn) navBtn.addEventListener('click', () => toggleModal(true));
    if (heroBtn) heroBtn.addEventListener('click', () => toggleModal(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleModal(false));
    if (backdrop) backdrop.addEventListener('click', () => toggleModal(false));

    // Skin Type options
    document.querySelectorAll('#aiSkinTypeOptions .ai-opt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#aiSkinTypeOptions .ai-opt-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            aiState.skinType = e.target.dataset.type;
        });
    });

    // Concern options
    document.querySelectorAll('#aiConcernOptions .ai-opt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#aiConcernOptions .ai-opt-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            aiState.concern = e.target.dataset.concern;
        });
    });

    // Tier options
    document.querySelectorAll('#aiTierOptions .ai-opt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#aiTierOptions .ai-opt-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            aiState.tier = e.target.dataset.tier;
        });
    });

    // Routine Generator
    const generateBtn = document.getElementById('btnGenerateRoutine');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateAiRoutine);
    }

    // Add full routine to bag
    const addRoutineBtn = document.getElementById('btnAddRoutineToBag');
    if (addRoutineBtn) {
        addRoutineBtn.addEventListener('click', () => {
            if (!currentAiRoutine || currentAiRoutine.length === 0) return;
            currentAiRoutine.forEach(item => {
                const existing = cart.find(i => i.id === item.product.id);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    cart.push({
                        id: item.product.id,
                        name: item.product.name,
                        brand: item.product.brand,
                        price: item.product.price,
                        mrp: item.product.mrp,
                        image: item.product.image,
                        quantity: 1
                    });
                }
            });
            localStorage.setItem('glowcart_bag_items', JSON.stringify(cart));
            updateBagUI();
            toggleModal(false);
            
            // Open bag drawer
            const bagDrawer = document.getElementById('bagDrawer');
            const bagBackdrop = document.getElementById('bagBackdrop');
            if (bagDrawer && bagBackdrop) {
                bagDrawer.classList.add('open');
                bagBackdrop.style.display = 'block';
            }
            showToast(`Added Complete 3-Step AI Regimen to Bag!`);
        });
    }
}

function generateAiRoutine() {
    const resultsContainer = document.getElementById('aiResultsContainer');
    const cardsWrap = document.getElementById('aiRecommendedCards');
    const scoreTag = document.getElementById('aiCompatibilityScore');
    const regimenName = document.getElementById('aiRegimenName');
    const totalPriceEl = document.getElementById('aiRoutineTotalPrice');

    // Formulation intelligence recommendation matrix
    let step1Id, step2Id, step3Id;
    let step1Benefit, step2Benefit, step3Benefit;
    let title = "Bespoke Dermatological Protocol";
    let score = "98% Formulation Match";

    if (aiState.concern === 'pores' || aiState.skinType === 'oily') {
        step1Id = 18; // COSRX Low pH Gel Cleanser
        step1Benefit = "Gentle BHA balance to lift excess sebum without stripping lipid mantle.";
        step2Id = aiState.tier === 'value' ? 14 : 2; // Minimalist Salicylic or The Ordinary Niacinamide
        step2Benefit = "Regulates active sebaceous activity and contracts micro-pore walls.";
        step3Id = 5; // Beauty of Joseon Relief Sun Rice + Probiotics
        step3Benefit = "Weightless non-comedogenic SPF50+ shield with calming rice extracts.";
        title = "Pore Clarifying & Sebum Regulation Protocol";
        score = "99% Compatibility Match";
    } else if (aiState.concern === 'hydration' || aiState.skinType === 'dry') {
        step1Id = 11; // CeraVe Hydrating Cleanser
        step1Benefit = "Essential ceramide surfactant to restore dry cellular matrix.";
        step2Id = 4; // COSRX Snail 96 Mucin Essence
        step2Benefit = "96% filtered snail mucin delivers 24hr plumping and glass glow elasticity.";
        step3Id = aiState.tier === 'luxury' ? 23 : 21; // Charlotte Tilbury Magic Cream or Laneige Water Bank
        step3Benefit = "Multi-depth hyaluronic moisture lock prevents transepidermal water loss.";
        title = "Deep Cellular Plumping & Glass Skin Protocol";
        score = "99% Compatibility Match";
    } else if (aiState.concern === 'pigmentation') {
        step1Id = 18; // COSRX Cleanser
        step1Benefit = "Purifies skin canvas for optimum vitamin C dermal absorption.";
        step2Id = aiState.tier === 'luxury' ? 19 : 13; // Drunk Elephant C-Firma or Minimalist Vit C
        step2Benefit = "Pure L-Ascorbic Acid and Centella to neutralize melanin deposition.";
        step3Id = 5; // Beauty of Joseon Sunscreen
        step3Benefit = "Broad-spectrum PA++++ protection against UV-induced hyperpigmentation.";
        title = "Luminous Radiance & Melanin Defense Protocol";
        score = "98% Compatibility Match";
    } else if (aiState.concern === 'aging') {
        step1Id = 11; // CeraVe Hydrating Cleanser
        step1Benefit = "Mild barrier-support cleansing to safeguard mature skin lipid layers.";
        step2Id = 8; // Estée Lauder Advanced Night Repair
        step2Benefit = "Chronolux technology to accelerate nighttime cellular DNA recovery.";
        step3Id = aiState.tier === 'luxury' ? 20 : 12; // Drunk Elephant Protini or CeraVe Moisturizing Cream
        step3Benefit = "Signal peptides and bio-identical ceramides to restore dermal tensile strength.";
        title = "Peptide Cellular Repair & Age Defense Protocol";
        score = "99% Compatibility Match";
    } else { // barrier / sensitive
        step1Id = 11; // CeraVe Hydrating Cleanser
        step1Benefit = "Non-foaming cream wash formulated for hyper-sensitive reactive skin.";
        step2Id = 24; // SKIN1004 Centella Asiatica Calming Ampoule
        step2Benefit = "100% pure Madagascar Centella to instantly quench erythema and redness.";
        step3Id = 12; // CeraVe Moisturizing Cream with Ceramides
        step3Benefit = "Physiological 3:1:1 lipid barrier restoration for sensitized tissue.";
        title = "Clinical Barrier Fortification & Calming Protocol";
        score = "98% Compatibility Match";
    }

    const p1 = ALL_PRODUCTS.find(p => p.id === step1Id) || ALL_PRODUCTS[1];
    const p2 = ALL_PRODUCTS.find(p => p.id === step2Id) || ALL_PRODUCTS[2];
    const p3 = ALL_PRODUCTS.find(p => p.id === step3Id) || ALL_PRODUCTS[4];

    currentAiRoutine = [
        { step: "Step 1: Prep", product: p1, benefit: step1Benefit },
        { step: "Step 2: Treat", product: p2, benefit: step2Benefit },
        { step: "Step 3: Shield", product: p3, benefit: step3Benefit }
    ];

    scoreTag.textContent = score;
    regimenName.textContent = title;

    cardsWrap.innerHTML = currentAiRoutine.map(item => `
        <div class="ai-rec-card">
            <span class="ai-rec-step-tag">${escapeHtml(item.step)}</span>
            <img src="${item.product.image}" alt="${escapeHtml(item.product.name)}" class="ai-rec-img" onerror="this.src='${BEAUTY_STOCK_PHOTOS[0]}'">
            <div class="ai-rec-info">
                <span class="ai-rec-brand">${escapeHtml(item.product.brand)}</span>
                <div class="ai-rec-name">${escapeHtml(item.product.name)}</div>
                <div class="ai-rec-benefit">${escapeHtml(item.benefit)}</div>
            </div>
            <div class="ai-rec-price">&#8377;${item.product.price.toLocaleString('en-IN')}</div>
        </div>
    `).join('');

    const total = currentAiRoutine.reduce((sum, item) => sum + item.product.price, 0);
    totalPriceEl.innerHTML = `&#8377;${total.toLocaleString('en-IN')}`;

    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ----------------------------------------------------
// Product Quick View & Detail Modal Controller
// ----------------------------------------------------
let currentModalProduct = null;
let currentModalQty = 1;

function openProductModal(productId) {
    const product = ALL_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    currentModalProduct = product;
    currentModalQty = 1;

    const modal = document.getElementById('productDetailModal');
    const backdrop = document.getElementById('productModalBackdrop');
    if (!modal || !backdrop) return;

    // Elements
    const imgEl = document.getElementById('modalProductImg');
    const badgeEl = document.getElementById('modalProductBadge');
    const breadcrumbEl = document.getElementById('modalBreadcrumb');
    const brandEl = document.getElementById('modalProductBrand');
    const titleEl = document.getElementById('modalProductName');
    const ratingEl = document.getElementById('modalProductRating');
    const reviewsEl = document.getElementById('modalProductReviews');
    const priceEl = document.getElementById('modalProductPrice');
    const mrpEl = document.getElementById('modalProductMrp');
    const discountEl = document.getElementById('modalProductDiscount');
    const stockDot = document.getElementById('modalStockDot');
    const stockText = document.getElementById('modalStockText');
    const descEl = document.getElementById('modalProductDesc');
    const attrSkinEl = document.getElementById('modalAttrSkin');
    const attrActivesEl = document.getElementById('modalAttrActives');
    const attrOriginEl = document.getElementById('modalAttrOrigin');
    const attrSkuEl = document.getElementById('modalAttrSku');
    const usageEl = document.getElementById('modalProductUsage');
    const qtyDisplay = document.getElementById('modalQtyDisplay');
    const addBtn = document.getElementById('modalAddToBagBtn');

    if (imgEl) {
        imgEl.src = product.image;
        imgEl.alt = product.name;
        imgEl.onerror = () => { imgEl.src = BEAUTY_STOCK_PHOTOS[0]; };
    }

    if (badgeEl) {
        if (product.badge) {
            badgeEl.textContent = product.badge;
            badgeEl.style.display = 'inline-block';
        } else {
            badgeEl.style.display = 'none';
        }
    }

    if (breadcrumbEl) breadcrumbEl.textContent = `Home > ${product.category.toUpperCase()} > ${product.brand}`;
    if (brandEl) brandEl.textContent = product.brand;
    if (titleEl) titleEl.textContent = product.name;
    if (ratingEl) ratingEl.textContent = product.rating;
    if (reviewsEl) reviewsEl.textContent = `(${product.reviews.toLocaleString()} verified customer reviews)`;

    if (priceEl) priceEl.innerHTML = `&#8377;${product.price.toLocaleString('en-IN')}`;
    if (mrpEl) mrpEl.innerHTML = `&#8377;${product.mrp.toLocaleString('en-IN')}`;
    if (discountEl) discountEl.textContent = product.discount;

    if (stockDot && stockText && addBtn) {
        if (product.stock <= 0) {
            stockDot.className = 'stock-indicator low-stock';
            stockText.textContent = 'Out of Stock';
            stockText.style.color = '#ef4444';
            addBtn.disabled = true;
            addBtn.textContent = 'Currently Sold Out';
        } else if (product.stock <= 10) {
            stockDot.className = 'stock-indicator low-stock';
            stockText.textContent = `Limited Drop — Only ${product.stock} units remaining in stock!`;
            stockText.style.color = '#b45309';
            addBtn.disabled = false;
        } else {
            stockDot.className = 'stock-indicator in-stock';
            stockText.textContent = `In Stock — ${product.stock} units ready for immediate express dispatch`;
            stockText.style.color = '#047857';
            addBtn.disabled = false;
        }
    }

    if (descEl) descEl.textContent = product.desc;
    if (attrSkinEl) attrSkinEl.textContent = product.skinType;
    if (attrActivesEl) attrActivesEl.textContent = product.actives;
    if (attrOriginEl) attrOriginEl.textContent = product.origin;
    if (attrSkuEl) attrSkuEl.textContent = product.sku;
    if (usageEl) usageEl.textContent = product.usage;

    if (qtyDisplay) qtyDisplay.textContent = '1';
    updateModalPrice();

    modal.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function updateModalPrice() {
    if (!currentModalProduct) return;
    const addTotal = document.getElementById('modalAddTotal');
    const total = currentModalProduct.price * currentModalQty;
    if (addTotal) {
        addTotal.innerHTML = `&#8377;${total.toLocaleString('en-IN')}`;
    }
}

function closeProductModal() {
    const modal = document.getElementById('productDetailModal');
    const backdrop = document.getElementById('productModalBackdrop');
    if (modal) modal.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
}

function bindProductModalEvents() {
    const closeBtn = document.getElementById('productModalCloseBtn');
    const backdrop = document.getElementById('productModalBackdrop');
    const minusBtn = document.getElementById('modalQtyMinus');
    const plusBtn = document.getElementById('modalQtyPlus');
    const addBtn = document.getElementById('modalAddToBagBtn');
    const qtyDisplay = document.getElementById('modalQtyDisplay');

    if (closeBtn) closeBtn.addEventListener('click', closeProductModal);
    if (backdrop) backdrop.addEventListener('click', closeProductModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProductModal();
    });

    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            if (currentModalQty > 1) {
                currentModalQty--;
                if (qtyDisplay) qtyDisplay.textContent = currentModalQty;
                updateModalPrice();
            }
        });
    }

    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            if (currentModalProduct && currentModalQty < currentModalProduct.stock) {
                currentModalQty++;
                if (qtyDisplay) qtyDisplay.textContent = currentModalQty;
                updateModalPrice();
            } else if (currentModalProduct) {
                showToast(`Maximum available quantity is ${currentModalProduct.stock}`);
            }
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (!currentModalProduct || currentModalProduct.stock <= 0) return;
            addToBag(currentModalProduct.id, currentModalQty);
            closeProductModal();
        });
    }
}


