-- Expand product_type enum to support more trailer categories
-- Needed for Dorsey (dry-van), Kalyn Siebert (container-chassis, specialized), SmithCo (dump-trailer)

ALTER TYPE product_type ADD VALUE IF NOT EXISTS 'dump-trailer';
ALTER TYPE product_type ADD VALUE IF NOT EXISTS 'dry-van';
ALTER TYPE product_type ADD VALUE IF NOT EXISTS 'container-chassis';
ALTER TYPE product_type ADD VALUE IF NOT EXISTS 'specialized';
