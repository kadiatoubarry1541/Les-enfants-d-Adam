#!/usr/bin/env python3
"""
Script pour créer automatiquement les tables IA dans la base de données du backend
Ce script utilise la même configuration que le backend
"""

import os
import sys
import psycopg2
from dotenv import load_dotenv

# Charger la configuration du backend
backend_config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend', 'config.env')
if os.path.exists(backend_config_path):
    load_dotenv(backend_config_path)
    print(f"✅ Configuration chargée depuis: {backend_config_path}")
else:
    print(f"⚠️ Fichier config.env du backend non trouvé: {backend_config_path}")
    print("Utilisation des valeurs par défaut...")
    load_dotenv()

# Récupérer les paramètres de connexion
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'enfants_adam_eve')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')

# Construire l'URL de connexion
if DB_PASSWORD:
    DATABASE_URL = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
else:
    DATABASE_URL = f'postgresql://{DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

print(f"🔗 Connexion à la base de données: {DB_NAME} sur {DB_HOST}:{DB_PORT}")

# SQL pour créer les tables IA
# Utilise les mêmes noms que dans app.py (sessions, messages)
CREATE_TABLES_SQL = """
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

-- Créer la table des conversations (pour compatibilité)
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

def create_ia_tables():
    """Crée les tables IA dans la base de données"""
    try:
        # Se connecter à la base de données
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        print("📊 Création des tables IA...")
        
        # Exécuter le script SQL
        cursor.execute(CREATE_TABLES_SQL)
        
        # Vérifier que les tables existent
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('sessions', 'messages', 'conversations')
            ORDER BY table_name;
        """)
        
        tables = cursor.fetchall()
        if tables:
            print("✅ Tables IA créées/vérifiées avec succès:")
            for table in tables:
                print(f"   • {table[0]}")
        else:
            print("⚠️ Aucune table IA trouvée")
        
        cursor.close()
        conn.close()
        
        print("✅ Base de données IA configurée avec succès!")
        return True
        
    except psycopg2.OperationalError as e:
        print(f"❌ Erreur de connexion à la base de données: {e}")
        print(f"   Vérifiez que PostgreSQL est démarré et que la base '{DB_NAME}' existe")
        return False
    except Exception as e:
        print(f"❌ Erreur lors de la création des tables: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("  Configuration automatique de la base de données IA")
    print("  Les Enfants d'Adam et Eve")
    print("=" * 60)
    print()
    
    success = create_ia_tables()
    
    if success:
        print()
        print("🎉 Configuration terminée avec succès!")
        sys.exit(0)
    else:
        print()
        print("❌ Échec de la configuration")
        sys.exit(1)
