CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    ekyc_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE financial_stress_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    profile_type VARCHAR(20) CHECK (profile_type IN ('avoider', 'worrier', 'ostrich')),
    confidence_score DECIMAL(3,2),
    anxiety_scan_responses JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    amount_encrypted BYTEA NOT NULL,
    category VARCHAR(50),
    transaction_date DATE,
    source VARCHAR(20) CHECK (source IN ('manual', 'smartreader', 'open_banking'))
);

CREATE TABLE debt_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    debt_name VARCHAR(100),
    total_amount_encrypted BYTEA NOT NULL,
    monthly_payment_encrypted BYTEA,
    remaining_months INTEGER,
    debt_type VARCHAR(50)
);

CREATE TABLE nudge_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    nudge_type VARCHAR(50),
    content JSONB,
    sent_at TIMESTAMP,
    opened_at TIMESTAMP,
    action_taken BOOLEAN DEFAULT FALSE
);

CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    milestone_type VARCHAR(50),
    achieved_at TIMESTAMP,
    celebration_sent BOOLEAN DEFAULT FALSE
);

CREATE TABLE behavioral_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(50),
    screen_name VARCHAR(50),
    duration_ms INTEGER,
    metadata JSONB,
    recorded_at TIMESTAMP DEFAULT NOW()
);
