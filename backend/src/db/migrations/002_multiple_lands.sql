-- Add location and khasra to land_verifications to support multiple lands per farmer
ALTER TABLE land_verifications ADD COLUMN IF NOT EXISTS khasra_number VARCHAR(100);
ALTER TABLE land_verifications ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE land_verifications ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
