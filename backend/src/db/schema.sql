-- Database schema for Bhumi AI Platform

-- Users table (officers, admins, farmers)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'officer',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Villages table
CREATE TABLE IF NOT EXISTS villages (
    id SERIAL PRIMARY KEY,
    state_name VARCHAR(100),
    district_name VARCHAR(100),
    sub_district_name VARCHAR(100),
    village_name VARCHAR(255),
    
    -- Area metrics
    total_area DECIMAL(10, 2),
    net_area_sown DECIMAL(10, 2),
    unirrigated_area DECIMAL(10, 2),
    irrigated_area DECIMAL(10, 2),
    distance_to_town_km DECIMAL(10, 2),
    
    -- AI calculated indicators
    agri_dependency_index DECIMAL(5, 3),
    irrigation_stress_index DECIMAL(5, 3),
    connectivity_risk_score DECIMAL(5, 3),
    priority_score DECIMAL(5, 3),
    priority_level VARCHAR(20),
    confidence_score DECIMAL(5, 2),
    
    -- Anomaly detection
    anomaly_flag BOOLEAN DEFAULT false,
    anomaly_reason TEXT,
    
    -- Trust score
    trust_score DECIMAL(5, 2) DEFAULT 0.5,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_villages_district ON villages(district_name);
CREATE INDEX IF NOT EXISTS idx_villages_state ON villages(state_name);
CREATE INDEX IF NOT EXISTS idx_villages_priority ON villages(priority_level);

-- Farmers table
CREATE TABLE IF NOT EXISTS farmers (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id),
    
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    aadhaar VARCHAR(20) UNIQUE,
    
    -- Farmer profile data
    land_size_hectares DECIMAL(10, 2),
    crop_type VARCHAR(100),
    irrigation_access BOOLEAN DEFAULT false,
    soil_condition VARCHAR(100),
    income_category VARCHAR(50),
    season VARCHAR(50),
    
    -- Location
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_farmers_village ON farmers(village_id);
CREATE INDEX IF NOT EXISTS idx_farmers_phone ON farmers(phone);

-- Schemes table (government schemes)
CREATE TABLE IF NOT EXISTS schemes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    eligibility_criteria JSONB,
    benefits TEXT,
    application_link VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scheme applications (farmer-scheme matching)
CREATE TABLE IF NOT EXISTS scheme_applications (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES farmers(id),
    scheme_id INTEGER REFERENCES schemes(id),
    
    status VARCHAR(50) DEFAULT 'pending',
    eligibility_score DECIMAL(5, 2),
    recommendation_reason TEXT,
    
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Surveys table
CREATE TABLE IF NOT EXISTS surveys (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id),
    officer_id INTEGER REFERENCES users(id),
    
    survey_type VARCHAR(50),
    data JSONB,
    
    is_verified BOOLEAN DEFAULT false,
    verification_score DECIMAL(5, 2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_surveys_village ON surveys(village_id);
