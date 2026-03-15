-- Link farmers to users table
ALTER TABLE farmers ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

-- Add verification_status to farmers if not already there (redundant but safe)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='farmers' AND column_name='verification_status') THEN
        ALTER TABLE farmers ADD COLUMN verification_status VARCHAR(50) DEFAULT 'unverified';
    END IF;
END $$;
