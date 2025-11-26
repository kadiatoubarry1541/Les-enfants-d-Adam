-- Migration pour ajouter le workflow État-Citoyen aux documents
-- Exécutez ce script dans votre base de données PostgreSQL

-- ============================================
-- 1. AMÉLIORER LA TABLE documents
-- ============================================

-- Ajouter les nouvelles colonnes
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS sent_by_state BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS state_agent_numero_h VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_validation_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS error_report TEXT,
ADD COLUMN IF NOT EXISTS error_reported_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS correction_notes TEXT,
ADD COLUMN IF NOT EXISTS corrected_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS previous_version_id UUID;

-- Ajouter les contraintes de clé étrangère (si elles n'existent pas)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_state_agent'
    ) THEN
        ALTER TABLE documents
        ADD CONSTRAINT fk_state_agent 
        FOREIGN KEY (state_agent_numero_h) 
        REFERENCES users(numero_h);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_previous_version'
    ) THEN
        ALTER TABLE documents
        ADD CONSTRAINT fk_previous_version 
        FOREIGN KEY (previous_version_id) 
        REFERENCES documents(id);
    END IF;
END $$;

-- Ajouter les index
CREATE INDEX IF NOT EXISTS idx_documents_sent_by_state ON documents(sent_by_state);
CREATE INDEX IF NOT EXISTS idx_documents_user_validation_status ON documents(user_validation_status);
CREATE INDEX IF NOT EXISTS idx_documents_state_agent ON documents(state_agent_numero_h);
CREATE INDEX IF NOT EXISTS idx_documents_version ON documents(version);

-- ============================================
-- 2. AMÉLIORER LA TABLE document_permissions
-- ============================================

-- Rendre document_type nullable (null = tous les types)
ALTER TABLE document_permissions
ALTER COLUMN document_type DROP NOT NULL;

-- Modifier permission_type pour accepter 'all', 'send', 'modify'
ALTER TABLE document_permissions
ALTER COLUMN permission_type SET DEFAULT 'all';

-- Ajouter la colonne role
ALTER TABLE document_permissions
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'state_agent';

-- Mettre à jour les valeurs existantes
UPDATE document_permissions
SET permission_type = 'all'
WHERE permission_type = 'both';

-- ============================================
-- 3. CRÉER LA TABLE document_validations
-- ============================================

CREATE TABLE IF NOT EXISTS document_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL CHECK (action IN ('confirmed', 'error_reported', 'corrected', 'resubmitted')),
  performed_by VARCHAR(255) NOT NULL REFERENCES users(numero_h),
  notes TEXT,
  error_details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour document_validations
CREATE INDEX IF NOT EXISTS idx_validations_document_id ON document_validations(document_id);
CREATE INDEX IF NOT EXISTS idx_validations_performed_by ON document_validations(performed_by);
CREATE INDEX IF NOT EXISTS idx_validations_action ON document_validations(action);
CREATE INDEX IF NOT EXISTS idx_validations_created_at ON document_validations(created_at);

-- ============================================
-- 4. CRÉER LE DÉCLENCHEUR POUR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger à document_validations
DROP TRIGGER IF EXISTS update_document_validations_updated_at ON document_validations;
CREATE TRIGGER update_document_validations_updated_at
    BEFORE UPDATE ON document_validations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. COMMENTAIRES POUR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN documents.sent_by_state IS 'Document envoyé par un agent de l''État';
COMMENT ON COLUMN documents.state_agent_numero_h IS 'NumeroH de l''agent de l''État qui a envoyé le document';
COMMENT ON COLUMN documents.user_validation_status IS 'Statut de validation par l''utilisateur: pending, confirmed, error_reported, corrected';
COMMENT ON COLUMN documents.error_report IS 'Erreurs signalées par l''utilisateur';
COMMENT ON COLUMN documents.error_reported_at IS 'Date de signalement d''erreur';
COMMENT ON COLUMN documents.correction_notes IS 'Notes de correction par l''agent';
COMMENT ON COLUMN documents.corrected_at IS 'Date de correction';
COMMENT ON COLUMN documents.version IS 'Version du document (incrémenté à chaque modification)';
COMMENT ON COLUMN documents.previous_version_id IS 'ID de la version précédente';

COMMENT ON COLUMN document_permissions.document_type IS 'Type de document spécifique (null = tous les types)';
COMMENT ON COLUMN document_permissions.permission_type IS 'Type de permission: send, modify, all';
COMMENT ON COLUMN document_permissions.role IS 'Rôle de l''agent: state_agent, admin, supervisor';

COMMENT ON TABLE document_validations IS 'Historique des validations et actions sur les documents';
COMMENT ON COLUMN document_validations.action IS 'Action effectuée: confirmed, error_reported, corrected, resubmitted';
COMMENT ON COLUMN document_validations.error_details IS 'Détails des erreurs signalées (JSON)';

-- ============================================
-- MIGRATION TERMINÉE
-- ============================================

SELECT 'Migration terminée avec succès !' AS status;

