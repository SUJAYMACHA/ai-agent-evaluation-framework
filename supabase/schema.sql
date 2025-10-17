-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create evaluation_settings table
CREATE TABLE IF NOT EXISTS evaluation_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    run_policy TEXT NOT NULL DEFAULT 'always' CHECK (run_policy IN ('always', 'sampled')),
    sample_rate_pct INTEGER NOT NULL DEFAULT 100 CHECK (sample_rate_pct >= 0 AND sample_rate_pct <= 100),
    obfuscate_pii BOOLEAN NOT NULL DEFAULT false,
    max_eval_per_day INTEGER NOT NULL DEFAULT 1000,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    interaction_id TEXT NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    score NUMERIC NOT NULL CHECK (score >= 0 AND score <= 1),
    latency_ms INTEGER NOT NULL,
    flags JSONB DEFAULT '[]'::jsonb,
    pii_tokens_redacted INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_evaluations_user_created ON evaluations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_settings_user_id ON evaluation_settings(user_id);

-- Enable Row Level Security
ALTER TABLE evaluation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for evaluation_settings
CREATE POLICY "Users can view their own settings"
    ON evaluation_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
    ON evaluation_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON evaluation_settings FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings"
    ON evaluation_settings FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for evaluations
CREATE POLICY "Users can view their own evaluations"
    ON evaluations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own evaluations"
    ON evaluations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own evaluations"
    ON evaluations FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own evaluations"
    ON evaluations FOR DELETE
    USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_evaluation_settings_updated_at
    BEFORE UPDATE ON evaluation_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
