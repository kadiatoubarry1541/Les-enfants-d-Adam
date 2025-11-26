-- Script SQL pour créer les tables nécessaires au système de commission
-- Commission de 5% sur chaque achat

-- Table des commandes (Orders)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    buyer_numero_h VARCHAR(20) NOT NULL,
    seller_numero_h VARCHAR(20) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    commission_rate DECIMAL(5, 2) NOT NULL DEFAULT 5.00,
    commission_amount DECIMAL(10, 2) NOT NULL,
    seller_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'GNF',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_product FOREIGN KEY (product_id) REFERENCES exchange_products(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_buyer FOREIGN KEY (buyer_numero_h) REFERENCES users(numero_h) ON DELETE CASCADE,
    CONSTRAINT fk_order_seller FOREIGN KEY (seller_numero_h) REFERENCES users(numero_h) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_numero_h);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_numero_h);
CREATE INDEX IF NOT EXISTS idx_orders_product ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Table des commissions de la plateforme
CREATE TABLE IF NOT EXISTS platform_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    buyer_numero_h VARCHAR(20) NOT NULL,
    seller_numero_h VARCHAR(20) NOT NULL,
    transaction_amount DECIMAL(10, 2) NOT NULL,
    commission_rate DECIMAL(5, 2) NOT NULL DEFAULT 5.00,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'GNF',
    status VARCHAR(20) NOT NULL DEFAULT 'collected',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_commission_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_commission_product FOREIGN KEY (product_id) REFERENCES exchange_products(id) ON DELETE CASCADE,
    CONSTRAINT fk_commission_buyer FOREIGN KEY (buyer_numero_h) REFERENCES users(numero_h) ON DELETE CASCADE,
    CONSTRAINT fk_commission_seller FOREIGN KEY (seller_numero_h) REFERENCES users(numero_h) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_commissions_order ON platform_commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON platform_commissions(status);
CREATE INDEX IF NOT EXISTS idx_commissions_created_at ON platform_commissions(created_at);

-- Ajouter les colonnes wallet au modèle User (si elles n'existent pas déjà)
-- Note: Exécutez ces commandes seulement si les colonnes n'existent pas
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet DECIMAL(10, 2) DEFAULT 0.00;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_currency VARCHAR(10) DEFAULT 'GNF';

-- Commentaires
COMMENT ON TABLE orders IS 'Table des commandes d''achat de produits';
COMMENT ON TABLE platform_commissions IS 'Table des commissions de la plateforme (5% sur chaque achat)';
COMMENT ON COLUMN orders.commission_rate IS 'Taux de commission en pourcentage (5%)';
COMMENT ON COLUMN orders.commission_amount IS 'Montant de la commission (5% du total)';
COMMENT ON COLUMN orders.seller_amount IS 'Montant reçu par le vendeur (total - commission)';

