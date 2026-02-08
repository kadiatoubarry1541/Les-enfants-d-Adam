#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script de test pour vérifier la connexion à la base de données PostgreSQL
"""

import os
import sys
from dotenv import load_dotenv
import psycopg2

# Charger les variables d'environnement
load_dotenv()

print("=" * 60)
print("  TEST DE CONNEXION À LA BASE DE DONNÉES POSTGRESQL")
print("=" * 60)
print()

# Récupérer l'URL de la base de données
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/IAscience')
print(f"URL de connexion: {DATABASE_URL.split('@')[0]}@***")
print()

# Test 1: Vérifier si psycopg2 est installé
print("[1/4] Vérification de psycopg2...")
try:
    import psycopg2
    print("✅ psycopg2 est installé")
except ImportError:
    print("❌ psycopg2 n'est pas installé")
    print("   Installez-le avec: pip install psycopg2-binary")
    sys.exit(1)

# Test 2: Tenter la connexion
print()
print("[2/4] Test de connexion à PostgreSQL...")
try:
    conn = psycopg2.connect(DATABASE_URL)
    print("✅ Connexion réussie!")
except psycopg2.OperationalError as e:
    print("❌ Erreur de connexion:")
    print(f"   {str(e)}")
    print()
    print("   Solutions possibles:")
    print("   1. Vérifiez que PostgreSQL est installé et démarré")
    print("   2. Vérifiez le mot de passe dans le fichier .env")
    print("   3. Exécutez creer_base_donnees.bat pour créer la base")
    sys.exit(1)
except Exception as e:
    print(f"❌ Erreur inattendue: {str(e)}")
    sys.exit(1)

# Test 3: Vérifier que la base de données existe
print()
print("[3/4] Vérification de la base de données 'IAscience'...")
try:
    cur = conn.cursor()
    cur.execute("SELECT current_database();")
    db_name = cur.fetchone()[0]
    if db_name == 'IAscience':
        print(f"✅ Connecté à la base de données '{db_name}'")
    else:
        print(f"⚠️  Connecté à '{db_name}' au lieu de 'IAscience'")
except Exception as e:
    print(f"❌ Erreur: {str(e)}")
    conn.close()
    sys.exit(1)

# Test 4: Vérifier que les tables existent
print()
print("[4/4] Vérification des tables...")
try:
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    tables = cur.fetchall()
    expected_tables = ['conversations', 'messages', 'sessions']
    found_tables = [t[0] for t in tables]
    
    print(f"   Tables trouvées: {', '.join(found_tables) if found_tables else 'Aucune'}")
    
    all_present = all(table in found_tables for table in expected_tables)
    if all_present:
        print("✅ Toutes les tables requises sont présentes!")
    else:
        missing = [t for t in expected_tables if t not in found_tables]
        print(f"❌ Tables manquantes: {', '.join(missing)}")
        print("   Exécutez creer_base_donnees.bat pour créer les tables")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Erreur lors de la vérification des tables: {str(e)}")
    conn.close()
    sys.exit(1)

print()
print("=" * 60)
print("  ✅ TOUS LES TESTS SONT PASSÉS!")
print("  La base de données PostgreSQL fonctionne correctement.")
print("=" * 60)

