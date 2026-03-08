-- Personnes masquées dans mon arbre (liste de numeroH) : je ne les vois plus
-- PostgreSQL:
ALTER TABLE users ADD COLUMN IF NOT EXISTS tree_hidden JSONB DEFAULT '[]';
-- Si votre SGBD est MySQL, utilisez plutôt:
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS tree_hidden JSON DEFAULT ('[]');
