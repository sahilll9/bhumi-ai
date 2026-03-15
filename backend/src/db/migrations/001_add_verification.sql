-- Add verification columns to farmers table
ALTER TABLE farmers ADD COLUMN IF NOT EXISTS khasra_number VARCHAR(100);
ALTER TABLE farmers ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'unverified';

-- Create land_verifications table
CREATE TABLE IF NOT EXISTS land_verifications (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES farmers(id),
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    ai_confidence DECIMAL(5, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_land_verifications_farmer ON land_verifications(farmer_id);
