-- ======================================================
-- FASE 2: CONECTORES API - SCHEMA COMPLETO
-- Aplicar no Supabase Dashboard > SQL Editor
-- ======================================================

-- ======================================================
-- TABELA METRICS_DAILY (Compartilhada)
-- ======================================================

-- Create metrics_daily table
CREATE TABLE IF NOT EXISTS metrics_daily (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    platform TEXT NOT NULL,
    campaign_id TEXT,
    campaign_name TEXT,
    ad_group_id TEXT,
    ad_group_name TEXT,
    ad_id TEXT,
    ad_name TEXT,
    spend NUMERIC(12, 2) DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions NUMERIC(10, 2) DEFAULT 0,
    roas NUMERIC(10, 4) DEFAULT 0,
    cpc NUMERIC(10, 2) DEFAULT 0,
    cpm NUMERIC(10, 2) DEFAULT 0,
    ctr NUMERIC(7, 4) DEFAULT 0,
    conversion_rate NUMERIC(7, 4) DEFAULT 0,
    sessions INTEGER DEFAULT 0,
    bounce_rate NUMERIC(7, 4) DEFAULT 0,
    custom_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT metrics_daily_unique_key UNIQUE (client_id, metric_date, platform, COALESCE(campaign_id, 'N/A'))
);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_metrics_daily_updated_at
    BEFORE UPDATE ON metrics_daily
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_metrics_daily_client_date_platform_campaign 
    ON metrics_daily (client_id, metric_date, platform, campaign_id);

CREATE INDEX IF NOT EXISTS idx_metrics_daily_ad_group_id 
    ON metrics_daily (ad_group_id) WHERE ad_group_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_metrics_daily_ad_id 
    ON metrics_daily (ad_id) WHERE ad_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE metrics_daily ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for users to view their client metrics
CREATE POLICY "Users can view metrics for their clients"
    ON metrics_daily
    FOR SELECT
    USING (
        client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    );

-- Create RLS policy for service role (cron jobs)
CREATE POLICY "Service role has full access to metrics_daily"
    ON metrics_daily
    FOR ALL
    USING (auth.role() = 'service_role');

-- ======================================================
-- TABELA META_TOKENS
-- ======================================================

CREATE TABLE IF NOT EXISTS meta_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    token_type TEXT DEFAULT 'Bearer',
    expires_at TIMESTAMPTZ,
    refresh_token TEXT,
    scope TEXT,
    ad_account_id TEXT,
    business_id TEXT,
    user_id_meta TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create trigger for meta_tokens
CREATE TRIGGER update_meta_tokens_updated_at
    BEFORE UPDATE ON meta_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE meta_tokens ENABLE ROW LEVEL SECURITY;

-- RLS policies for meta_tokens
CREATE POLICY "Users can manage their meta tokens"
    ON meta_tokens
    FOR ALL
    USING (
        client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role has full access to meta_tokens"
    ON meta_tokens
    FOR ALL
    USING (auth.role() = 'service_role');

-- ======================================================
-- TABELA GOOGLE_ADS_TOKENS
-- ======================================================

CREATE TABLE IF NOT EXISTS google_ads_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    token_type TEXT DEFAULT 'Bearer',
    expires_at TIMESTAMPTZ,
    scope TEXT,
    customer_id TEXT,
    developer_token TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create trigger for google_ads_tokens
CREATE TRIGGER update_google_ads_tokens_updated_at
    BEFORE UPDATE ON google_ads_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE google_ads_tokens ENABLE ROW LEVEL SECURITY;

-- RLS policies for google_ads_tokens
CREATE POLICY "Users can manage their google ads tokens"
    ON google_ads_tokens
    FOR ALL
    USING (
        client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role has full access to google_ads_tokens"
    ON google_ads_tokens
    FOR ALL
    USING (auth.role() = 'service_role');

-- ======================================================
-- TABELA TIKTOK_ADS_TOKENS
-- ======================================================

CREATE TABLE IF NOT EXISTS tiktok_ads_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_type TEXT DEFAULT 'Bearer',
    expires_at TIMESTAMPTZ,
    scope TEXT,
    advertiser_id TEXT,
    business_center_id TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create trigger for tiktok_ads_tokens
CREATE TRIGGER update_tiktok_ads_tokens_updated_at
    BEFORE UPDATE ON tiktok_ads_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE tiktok_ads_tokens ENABLE ROW LEVEL SECURITY;

-- RLS policies for tiktok_ads_tokens
CREATE POLICY "Users can manage their tiktok ads tokens"
    ON tiktok_ads_tokens
    FOR ALL
    USING (
        client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role has full access to tiktok_ads_tokens"
    ON tiktok_ads_tokens
    FOR ALL
    USING (auth.role() = 'service_role');

-- ======================================================
-- TABELA GA4_TOKENS
-- ======================================================

CREATE TABLE IF NOT EXISTS ga4_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    token_type TEXT DEFAULT 'Bearer',
    expires_at TIMESTAMPTZ,
    scope TEXT,
    property_id TEXT,
    account_id TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create trigger for ga4_tokens
CREATE TRIGGER update_ga4_tokens_updated_at
    BEFORE UPDATE ON ga4_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE ga4_tokens ENABLE ROW LEVEL SECURITY;

-- RLS policies for ga4_tokens
CREATE POLICY "Users can manage their ga4 tokens"
    ON ga4_tokens
    FOR ALL
    USING (
        client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role has full access to ga4_tokens"
    ON ga4_tokens
    FOR ALL
    USING (auth.role() = 'service_role');

-- ======================================================
-- VERIFICAÇÕES FINAIS
-- ======================================================

-- Listar todas as tabelas criadas
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('clients', 'metrics_daily', 'meta_tokens', 'google_ads_tokens', 'tiktok_ads_tokens', 'ga4_tokens'); 