-- Script SQL pour créer la base de données IAscience
-- Exécutez ce script dans PostgreSQL pour créer la base de données et les tables

-- Créer la base de données (si elle n'existe pas déjà)
CREATE DATABASE IAscience;

-- Se connecter à la base de données IAscience
\c IAscience;

-- Créer la table des conversations
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table des sessions (pour garder l'historique par session)
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table des messages (liée aux sessions)
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES sessions(session_id) ON DELETE CASCADE,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_created_at ON messages(created_at);

-- Afficher un message de confirmation
SELECT 'Base de donnees IAscience creee avec succes!' AS message;

