-- MerchMind PostgreSQL Schema
-- Run: psql -U merchmind -d merchmind -f schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";  -- pgvector for embeddings

-- ── Users ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role        VARCHAR(50) DEFAULT 'planner' CHECK (role IN ('planner','manager','analyst','finance','admin')),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── SKUs ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skus (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku_code    VARCHAR(50) UNIQUE NOT NULL,
    name        VARCHAR(255) NOT NULL,
    category    VARCHAR(100),
    sub_category VARCHAR(100),
    brand       VARCHAR(100),
    cost_price  DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    embedding   vector(384),  -- pgvector: semantic SKU similarity
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Stores ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stores (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_code  VARCHAR(50) UNIQUE NOT NULL,
    name        VARCHAR(255) NOT NULL,
    region      VARCHAR(100),
    city        VARCHAR(100),
    channel     VARCHAR(50) CHECK (channel IN ('physical','online','marketplace')),
    is_active   BOOLEAN DEFAULT TRUE
);

-- ── Inventory ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku_id      UUID REFERENCES skus(id),
    store_id    UUID REFERENCES stores(id),
    quantity    INTEGER NOT NULL DEFAULT 0,
    days_on_shelf INTEGER DEFAULT 0,
    reorder_point INTEGER DEFAULT 10,
    max_stock_level INTEGER DEFAULT 200,
    last_replenished_at TIMESTAMPTZ,
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sku_id, store_id)
);

-- ── Sales Transactions ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sales (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku_id      UUID REFERENCES skus(id),
    store_id    UUID REFERENCES stores(id),
    quantity    INTEGER NOT NULL,
    unit_price  DECIMAL(10,2),
    discount_pct DECIMAL(5,2) DEFAULT 0,
    sale_date   DATE NOT NULL,
    channel     VARCHAR(50),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_sales_sku_date ON sales(sku_id, sale_date);
CREATE INDEX idx_sales_store_date ON sales(store_id, sale_date);

-- ── Replenishment Orders ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS replenishment_orders (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku_id      UUID REFERENCES skus(id),
    store_id    UUID REFERENCES stores(id),
    suggested_qty INTEGER NOT NULL,
    approved_qty  INTEGER,
    urgency     VARCHAR(20) DEFAULT 'medium',
    confidence_pct DECIMAL(5,2),
    status      VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','fulfilled')),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    expected_delivery DATE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Markdown Schedule ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS markdown_schedule (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku_id      UUID REFERENCES skus(id),
    store_id    UUID REFERENCES stores(id),
    current_price DECIMAL(10,2),
    discount_pct  DECIMAL(5,2),
    new_price     DECIMAL(10,2),
    optimal_date  DATE,
    projected_sell_through DECIMAL(5,2),
    confidence_pct DECIMAL(5,2),
    rationale   TEXT,
    status      VARCHAR(30) DEFAULT 'pending',
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Assortment Recommendations ─────────────────────────────────
CREATE TABLE IF NOT EXISTS assortment_recommendations (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku_id      UUID REFERENCES skus(id),
    region      VARCHAR(100),
    score       DECIMAL(5,2),
    action      VARCHAR(20) CHECK (action IN ('expand','hold','reduce','exit')),
    reason      TEXT,
    velocity    DECIMAL(6,2),
    model_version VARCHAR(50),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── AI Agent Audit Log ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agent_audit_log (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name  VARCHAR(100),
    action_type VARCHAR(100),
    input_data  JSONB,
    output_data JSONB,
    steps       JSONB,
    triggered_by UUID REFERENCES users(id),
    execution_ms INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed demo data
INSERT INTO users (name, email, password_hash, role) VALUES
    ('Priya Sharma', 'planner@merchmind.ai', '$2b$10$placeholder_hash', 'planner'),
    ('Rahul Verma',  'manager@merchmind.ai', '$2b$10$placeholder_hash', 'manager'),
    ('Ananya Das',   'finance@merchmind.ai', '$2b$10$placeholder_hash', 'finance'),
    ('Admin User',   'admin@merchmind.ai',   '$2b$10$placeholder_hash', 'admin')
ON CONFLICT (email) DO NOTHING;
