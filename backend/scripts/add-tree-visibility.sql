-- Visibilité dans l'arbre : ce que les autres voient de moi
-- name_only | name_photo | name_photo_numeroH (défaut)
ALTER TABLE users ADD COLUMN IF NOT EXISTS tree_visibility VARCHAR(50) DEFAULT 'name_photo_numeroH';
