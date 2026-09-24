-- ============================================================================
-- NAGAR SEVA AI - SUPABASE DATABASE SCHEMA
-- ============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY, -- Maps to Supabase Auth User ID (UUID string)
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    whatsapp_number VARCHAR(20) UNIQUE,
    whatsapp_linked_at TIMESTAMP WITH TIME ZONE,
    full_name VARCHAR(100),
    profile_image TEXT,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_aadhaar_verified BOOLEAN DEFAULT FALSE,
    aadhaar_last4 VARCHAR(4), -- Strictly store last 4 digits only
    verification_reference VARCHAR(100), -- DigiLocker / Aadhaar Provider reference ID
    verification_timestamp TIMESTAMP WITH TIME ZONE,
    role VARCHAR(20) DEFAULT 'citizen', -- 'citizen' or 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast user lookup by phone, email, and WhatsApp
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_whatsapp ON users(whatsapp_number);

-- 2. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(36) PRIMARY KEY,
    citizen_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    citizen_name VARCHAR(100) NOT NULL DEFAULT 'Verified Citizen',
    image_url TEXT NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    category VARCHAR(50) NOT NULL DEFAULT 'Other',
    status VARCHAR(20) NOT NULL DEFAULT 'Pending', -- Pending, In Progress, Resolved, Rejected
    ai_summary TEXT,
    predicted_category VARCHAR(50),
    estimated_severity VARCHAR(20) DEFAULT 'Medium', -- Low, Medium, High, Critical
    support_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);

-- 3. SUPPORTS TABLE (Enforces 1 support per verified user per complaint)
CREATE TABLE IF NOT EXISTS supports (
    id VARCHAR(36) PRIMARY KEY,
    complaint_id VARCHAR(36) REFERENCES complaints(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_complaint_support UNIQUE (complaint_id, user_id)
);
