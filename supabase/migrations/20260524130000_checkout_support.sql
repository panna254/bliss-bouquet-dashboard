-- Checkout support: profile insert policy + storefront product catalog seed.
-- Safe to re-run: uses DROP POLICY IF EXISTS and skips existing products by name+category.

drop policy if exists "Users insert own profile" on public.profiles;

create policy "Users insert own profile"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

-- Seed catalog rows that match src/data/products.ts (cart local IDs resolve by name + category).
insert into public.products (name, description, price, image_url, stock_quantity, category)
select v.name, v.description, v.price, v.image_url, v.stock_quantity, v.category
from (
  values
    ('Dreams Bouquet', 'Stunning roses bouquet with white peonies and eucalyptus, perfect for any special occasion.', 2600::numeric, 'https://placehold.co/800x600?text=Dreams+Bouquet', 50, 'bouquets'),
    ('Rose Gift Set', 'Elegant bouquet featuring fresh roses, seasonal flowers, and a special touch of rolled notes.', 8000::numeric, 'https://placehold.co/800x600?text=Rose+Gift+Set', 50, 'gift-sets'),
    ('Packed Roses Bouquet', 'Exquisite packed roses bouquet, hand-tied with seasonal foliage.', 3000::numeric, 'https://placehold.co/800x600?text=Packed+Roses', 50, 'bouquets'),
    ('Elegant Rose Gift Hamper', 'A luxurious rose gift hamper with premium roses and complementary gifts.', 7500::numeric, 'https://placehold.co/800x600?text=Rose+Hamper', 50, 'gift-sets'),
    ('Premium Rose Box', 'Luxury long-stem roses in elegant gift box with gold accents.', 3000::numeric, 'https://placehold.co/800x600?text=Premium+Rose+Box', 50, 'roses'),
    ('Tulip Flowers Gift Set', 'Fresh tulips in a decorative vase with complementary foliage.', 7500::numeric, 'https://placehold.co/800x600?text=Tulip+Gift+Set', 50, 'gift-sets'),
    ('Purple and Red Roses Bouquet', 'A stunning mix of purple and red roses.', 3000::numeric, 'https://placehold.co/800x600?text=Purple+Red+Roses', 50, 'bouquets'),
    ('Red Rose Flower Bouquet', 'Classic bouquet of fresh red roses.', 3000::numeric, 'https://placehold.co/800x600?text=Red+Rose+Bouquet', 50, 'bouquets'),
    ('Premium Red Roses & Fine Wine Gift Set', 'Premium red roses paired with a fine bottle of wine.', 13500::numeric, 'https://placehold.co/800x600?text=Roses+Wine', 50, 'gift-sets'),
    ('Pink Teddy Bear & Red Roses Gift Set', 'Pink teddy bear paired with a dozen red roses.', 9500::numeric, 'https://placehold.co/800x600?text=Teddy+Roses', 50, 'gift-sets'),
    ('Red & Blue Roses bouquet', 'Classic red and blue roses in elegant presentation.', 4800::numeric, 'https://placehold.co/800x600?text=Red+Blue+Roses', 50, 'bouquets'),
    ('Luxury Roses Gift Box', 'Premium roses in a luxurious gift box.', 12500::numeric, 'https://placehold.co/800x600?text=Luxury+Roses+Box', 50, 'gift-sets'),
    ('Yellow Roses & Wine Gift Set', 'Yellow roses paired with a premium wine bottle.', 6500::numeric, 'https://placehold.co/800x600?text=Yellow+Roses+Wine', 50, 'gift-sets'),
    ('Romantic Red Roses & Teddy Bear Set', 'Red roses and a premium teddy bear.', 6300::numeric, 'https://placehold.co/800x600?text=Romantic+Set', 50, 'gift-sets'),
    ('Exotic Red Roses Collection', 'Rare red roses in a dramatic luxury arrangement.', 5500::numeric, 'https://placehold.co/800x600?text=Exotic+Roses', 50, 'roses'),
    ('Premium Red Roses & Fine Wine Set', 'Premium red roses with fine wine in a luxury gift box.', 8000::numeric, 'https://placehold.co/800x600?text=Roses+Wine+Set', 50, 'gift-sets'),
    ('Luxury Gold Money Bouquet', 'Kenyan shilling notes arranged as a luxury money bouquet.', 10000::numeric, 'https://placehold.co/800x600?text=Gold+Money+Bouquet', 50, 'money-bouquets'),
    ('Premium Money Rose Bouquet', 'Currency notes folded into rose shapes with satin ribbons.', 15000::numeric, 'https://placehold.co/800x600?text=Money+Rose+Bouquet', 50, 'money-bouquets')
) as v(name, description, price, image_url, stock_quantity, category)
where not exists (
  select 1
  from public.products existing
  where lower(trim(existing.name)) = lower(trim(v.name))
    and existing.category = v.category
);
