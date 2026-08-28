PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS admins (
 id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin', active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS games (
 id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, publisher TEXT, category TEXT, logo TEXT, banner TEXT, description TEXT, status TEXT NOT NULL DEFAULT 'active', popular INTEGER DEFAULT 0, featured INTEGER DEFAULT 0, tags_json TEXT, input_schema_json TEXT, provider_id TEXT, provider_product_code TEXT, sort_order INTEGER DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS game_inputs (
 id TEXT PRIMARY KEY, game_id TEXT NOT NULL REFERENCES games(id), field_key TEXT NOT NULL, label TEXT NOT NULL, placeholder TEXT, required INTEGER DEFAULT 0, min_len INTEGER, max_len INTEGER, validation TEXT, regex TEXT, helper_text TEXT, mask TEXT, sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS providers (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL, active INTEGER DEFAULT 1, config_json TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS products (
 id TEXT PRIMARY KEY, game_id TEXT NOT NULL REFERENCES games(id), provider_id TEXT REFERENCES providers(id), provider_product_code TEXT, name TEXT NOT NULL, amount REAL, cost_price INTEGER, sell_price INTEGER NOT NULL, promo_price INTEGER, active INTEGER DEFAULT 1, sort_order INTEGER DEFAULT 0, eta_seconds INTEGER, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS orders (
 id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), status TEXT NOT NULL, game_id TEXT NOT NULL, product_id TEXT NOT NULL, product_name TEXT NOT NULL, total INTEGER NOT NULL, email TEXT NOT NULL, whatsapp TEXT, input_json TEXT NOT NULL, idempotency_key TEXT UNIQUE, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE TABLE IF NOT EXISTS order_items (
 id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), product_id TEXT NOT NULL, quantity INTEGER NOT NULL, unit_price INTEGER NOT NULL, subtotal INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS payments (
 id INTEGER PRIMARY KEY AUTOINCREMENT, order_id TEXT NOT NULL REFERENCES orders(id), provider TEXT NOT NULL, provider_order_id TEXT, status TEXT NOT NULL, gross_amount INTEGER NOT NULL, transaction_id TEXT, created_at TEXT NOT NULL, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS payment_events (
 id INTEGER PRIMARY KEY AUTOINCREMENT, order_id TEXT NOT NULL, event_type TEXT NOT NULL, payload_json TEXT NOT NULL, created_at TEXT NOT NULL, UNIQUE(order_id,event_type,payload_json)
);
CREATE TABLE IF NOT EXISTS provider_transactions (
 id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), provider_id TEXT NOT NULL, provider_reference TEXT, status TEXT NOT NULL, request_json TEXT, response_json TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS refunds (
 id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), status TEXT NOT NULL, reason TEXT NOT NULL, description TEXT NOT NULL, idempotency_key TEXT UNIQUE, provider_ref TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_refunds_order ON refunds(order_id);
CREATE TABLE IF NOT EXISTS refund_events (
 id INTEGER PRIMARY KEY AUTOINCREMENT, refund_id TEXT NOT NULL, event_type TEXT NOT NULL, payload_json TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS promo_codes (
 id TEXT PRIMARY KEY, code TEXT UNIQUE NOT NULL, type TEXT NOT NULL, value INTEGER NOT NULL, min_transaction INTEGER DEFAULT 0, max_discount INTEGER, starts_at TEXT, ends_at TEXT, usage_limit INTEGER, per_user_limit INTEGER, game_restriction TEXT, category_restriction TEXT, active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS promo_usages (id INTEGER PRIMARY KEY AUTOINCREMENT, promo_id TEXT NOT NULL, user_id TEXT, order_id TEXT NOT NULL, used_at TEXT NOT NULL, UNIQUE(promo_id,order_id));
CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, user_id TEXT, order_id TEXT, rating INTEGER, content TEXT, status TEXT DEFAULT 'pending', created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS support_tickets (id TEXT PRIMARY KEY, order_id TEXT, email TEXT NOT NULL, name TEXT NOT NULL, message TEXT NOT NULL, status TEXT NOT NULL, idempotency_key TEXT UNIQUE, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, actor_id TEXT, action TEXT NOT NULL, entity_type TEXT, entity_id TEXT, metadata_json TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value_json TEXT NOT NULL, updated_at TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS service_categories (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL);
CREATE TABLE IF NOT EXISTS services (id TEXT PRIMARY KEY, category_id TEXT, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT, benefits_json TEXT, features_json TEXT, eta TEXT, price_from INTEGER, active INTEGER DEFAULT 1);
CREATE TABLE IF NOT EXISTS website_packages (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, price INTEGER, promo_price INTEGER, description TEXT, page_count INTEGER, features_json TEXT, eta TEXT, active INTEGER DEFAULT 1);
CREATE TABLE IF NOT EXISTS package_features (id TEXT PRIMARY KEY, package_id TEXT NOT NULL, feature TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS portfolio_projects (id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, category TEXT, description TEXT, technologies_json TEXT, thumbnail TEXT, demo_url TEXT, featured INTEGER DEFAULT 0, published INTEGER DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS portfolio_images (id TEXT PRIMARY KEY, project_id TEXT NOT NULL, url TEXT NOT NULL, alt TEXT, sort_order INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS inquiries (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, whatsapp TEXT, website_type TEXT, package_id TEXT, budget INTEGER, reference_url TEXT, features TEXT, deadline TEXT, notes TEXT, status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS quotes (id TEXT PRIMARY KEY, inquiry_id TEXT NOT NULL, amount INTEGER, scope_json TEXT, valid_until TEXT, status TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, inquiry_id TEXT, client_id TEXT, status TEXT, title TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS project_milestones (id TEXT PRIMARY KEY, project_id TEXT NOT NULL, title TEXT, status TEXT, due_date TEXT);
CREATE TABLE IF NOT EXISTS project_revisions (id TEXT PRIMARY KEY, project_id TEXT NOT NULL, revision_no INTEGER, request TEXT, status TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS invoices (id TEXT PRIMARY KEY, project_id TEXT, invoice_no TEXT UNIQUE, status TEXT, subtotal INTEGER, discount INTEGER, total INTEGER, due_at TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS invoice_items (id TEXT PRIMARY KEY, invoice_id TEXT NOT NULL, description TEXT, quantity INTEGER, unit_price INTEGER, subtotal INTEGER);
CREATE TABLE IF NOT EXISTS client_payments (id TEXT PRIMARY KEY, invoice_id TEXT NOT NULL, amount INTEGER, provider TEXT, provider_reference TEXT, status TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS testimonials (id TEXT PRIMARY KEY, name TEXT, role TEXT, quote TEXT, status TEXT DEFAULT 'pending');
CREATE TABLE IF NOT EXISTS contact_messages (id TEXT PRIMARY KEY, name TEXT, email TEXT, message TEXT, status TEXT DEFAULT 'new', created_at TEXT NOT NULL);

-- Digital services/PPOB extension. Prices here are catalog metadata; final totals must be server/provider validated.
CREATE TABLE IF NOT EXISTS digital_service_categories (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, active INTEGER DEFAULT 1, sort_order INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS digital_services (id TEXT PRIMARY KEY, category_id TEXT REFERENCES digital_service_categories(id), name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT, field_schema_json TEXT, provider_id TEXT REFERENCES providers(id), active INTEGER DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS digital_products (id TEXT PRIMARY KEY, service_id TEXT NOT NULL REFERENCES digital_services(id), provider_product_code TEXT, name TEXT NOT NULL, face_value INTEGER, cost_price INTEGER, sell_price INTEGER, active INTEGER DEFAULT 1, metadata_json TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS digital_orders (id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), service_id TEXT NOT NULL REFERENCES digital_services(id), product_id TEXT REFERENCES digital_products(id), status TEXT NOT NULL, total INTEGER NOT NULL, target_json TEXT NOT NULL, email TEXT NOT NULL, whatsapp TEXT, provider_id TEXT REFERENCES providers(id), provider_reference TEXT, idempotency_key TEXT UNIQUE, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_digital_orders_status ON digital_orders(status);
CREATE INDEX IF NOT EXISTS idx_digital_orders_email ON digital_orders(email);

CREATE TABLE IF NOT EXISTS inquiry_idempotency (idempotency_key TEXT PRIMARY KEY, inquiry_id TEXT NOT NULL REFERENCES inquiries(id), status TEXT NOT NULL, created_at TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS manual_fulfillments (id TEXT PRIMARY KEY, order_id TEXT NOT NULL UNIQUE REFERENCES orders(id), status TEXT NOT NULL DEFAULT 'awaiting_admin', admin_note TEXT, fulfilled_by TEXT, fulfilled_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_manual_fulfillments_status ON manual_fulfillments(status);

-- Operational anti-abuse limiter. Best-effort; the application also uses a short-lived isolate cache.
CREATE TABLE IF NOT EXISTS rate_limits (
  bucket TEXT NOT NULL,
  client_key TEXT NOT NULL,
  count INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  PRIMARY KEY (bucket, client_key)
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_expires ON rate_limits(expires_at);

-- Stage 2: layered order ownership verification (OTP delivered to the order's registered email).
CREATE TABLE IF NOT EXISTS order_verifications (
 id TEXT PRIMARY KEY,
 order_id TEXT NOT NULL REFERENCES orders(id),
 contact TEXT NOT NULL,
 otp_hash TEXT NOT NULL,
 attempts INTEGER NOT NULL DEFAULT 0,
 access_token_hash TEXT,
 access_expires_at TEXT,
 expires_at TEXT NOT NULL,
 verified_at TEXT,
 used_at TEXT,
 created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_order_verifications_order ON order_verifications(order_id,created_at);
CREATE INDEX IF NOT EXISTS idx_order_verifications_expiry ON order_verifications(expires_at);

