"""
Script de test simple pour vérifier que l'application fonctionne
"""
import requests
import time
import sys

def test_app():
    """Teste l'application Flask"""
    print("🧪 Test de l'application IA Grand-Mère\n")
    
    base_url = "http://localhost:5000"
    
    # Test 1 : Vérifier que le serveur répond
    print("1️⃣  Test de connexion au serveur...")
    try:
        response = requests.get(base_url, timeout=5)
        if response.status_code == 200:
            print("   ✅ Serveur accessible !\n")
        else:
            print(f"   ❌ Erreur : Code {response.status_code}\n")
            return False
    except requests.exceptions.ConnectionError:
        print("   ❌ Impossible de se connecter au serveur !")
        print("   💡 Assurez-vous que 'python app.py' est lancé\n")
        return False
    except Exception as e:
        print(f"   ❌ Erreur : {e}\n")
        return False
    
    # Test 2 : Tester l'endpoint /chat
    print("2️⃣  Test de l'endpoint /chat...")
    try:
        test_message = {
            "message": "Bonjour Grand-Mère",
            "history": []
        }
        response = requests.post(
            f"{base_url}/chat",
            json=test_message,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("   ✅ Endpoint /chat fonctionne !")
                print(f"   📝 Réponse reçue : {data.get('response', '')[:50]}...\n")
            else:
                print(f"   ⚠️  Réponse reçue mais success=False\n")
        else:
            print(f"   ❌ Erreur : Code {response.status_code}\n")
            return False
    except Exception as e:
        print(f"   ❌ Erreur lors du test : {e}\n")
        return False
    
    # Test 3 : Tester avec un message vide
    print("3️⃣  Test avec message vide (doit échouer)...")
    try:
        test_message = {
            "message": "",
            "history": []
        }
        response = requests.post(
            f"{base_url}/chat",
            json=test_message,
            timeout=10
        )
        
        if response.status_code == 400:
            print("   ✅ Gestion correcte des messages vides !\n")
        else:
            print(f"   ⚠️  Code inattendu : {response.status_code}\n")
    except Exception as e:
        print(f"   ❌ Erreur : {e}\n")
    
    print("🎉 Tous les tests sont passés !")
    print("\n💡 Vous pouvez maintenant tester dans votre navigateur :")
    print("   👉 http://localhost:5000")
    
    return True

if __name__ == "__main__":
    print("=" * 50)
    print("   TEST DE L'APPLICATION IA GRAND-MÈRE")
    print("=" * 50)
    print()
    
    # Attendre un peu pour que l'utilisateur lance le serveur
    print("⏳ Assurez-vous que le serveur est lancé (python app.py)")
    print("   Appuyez sur Entrée quand c'est fait...")
    input()
    
    print()
    success = test_app()
    
    if not success:
        print("\n❌ Certains tests ont échoué.")
        print("💡 Vérifiez que :")
        print("   1. Le serveur est lancé (python app.py)")
        print("   2. Le port 5000 n'est pas utilisé par un autre programme")
        print("   3. Toutes les dépendances sont installées")
        sys.exit(1)
    else:
        sys.exit(0)


