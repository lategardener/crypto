# LateCrypto 🚀💸

LateCrypto est une plateforme de trading qui permet d'acheter, vendre, envoyer, retirer et échanger des cryptomonnaies.

# Accéder à tous les utilisateurs et leurs informations : http://localhost:8080/user/api/getUsers
# Accéder à la page d'accueil : http://localhost:8080/crypto/homePage (les informations sur la page d'accueil peuvent prendre du temps à charger parce qu'elles sont issues de l'API de Binance qui est une plateforme de cryptomonnaie)

# Deux utilisateurs ont déja été crées et des actions ont déja été éffectuées. Connectez-vous avec leurs identifiants pour un aperçu rapide!

# **README - Évaluation du Projet**

## **1. Fonctionnalités demandées**

### **1.1 Gestion d’entités**

- **Nombre d'entités** :
  - Le projet gère **au moins 5 entités** distinctes.✅
    - Exemple d’entités : User, Wallet, Transaction, Cryptocurrency, Profile, CryptoHolding.
      
- **Relations implémentées** :
  - **OneToOne** : User <-> Profile ✅
  - **OneToMany / ManyToOne** : User <-> Transaction ✅
  - **ManyToMany** : Transaction <-> CryptoHolding ✅

### **1.2 Association/dissociation graphique des entités**

- **Interface utilisateur** permettant de :✅
  - Associer ou dissocier graphiquement des relations **1-N** et **N-N**.
  - Exemple : Ajout/suppression de cryptomonnaies dans un portefeuille. ✅

### **1.3 Logique métier**
- L’application inclut une logique métier avancée, au-delà des simples opérations CRUD.
  - Exemple : Calcul des variations en temps réel de la valeur du portefeuille, des fluctuations de prix des différentes cryptomonnaies. ✅
  - Validation des transactions (exemple : vérification des fonds disponibles avant un retrait, un envoi, un échange ; vérification de solde avant achat de cryptomonnaies).✅

### **1.4 Repository Git**
- Le code source est disponible dans un repository Github. ✅
  - **Commits réguliers** : Oui (étant l'unique membre du groupe). ✅

---

## **2. Fonctionnalités techniques**

### **2.1 Manipulation des entités en BDD**

- **CRUD** ✅
  - [✅]  **Insérer** une entité en base de données (BDD). (ajout d'un nouvel utilisateur, d'une nouvelle cryptomonnaie, etc.)
  - [✅]  **Mettre à jour** une entité existante en BDD. (mise à jour de prix, de solde, des capitalisations boursières, etc.)
  - []  **Supprimer** une entité en BDD. (utilisé pour des tests avec Postman, mais n'a pas été mis en application concrètement)
  - [ ] **Chercher** une entité dans la BDD. (La fonctionnalité de recherche d'éléments n'a pas été implémentée. Mais pour pallier cela, les cryptomonnaies sont affichées par ordre décroissant pour simplifier un peu la recherche)

### **2.2 Liaison des entités** ✅
- [✅] **Lier deux entités** en BDD (exemple : associer un portefeuille à un utilisateur).
- [✅]  **Créer un lien entre deux entités** à partir de l’interface utilisateur, lors de l'achat d'une cryptomonnaie par exemple

---

### **3.1 Design pattern MVC**

- [✅]  **Modèle** : Gestion des entités et logique métier. ✅
- [✅]  **Vue** : Les pages affichent les données transmises par le contrôleur. ✅
- [✅]  **Contrôleur** : Réception et traitement des requêtes. ✅

### **3.2 Utilisation des méthodes HTTP**
- [✅]  **GET** : Récupération de données. ✅
- [✅]  **POST** : Création de ressources. ✅
- [✅]  **PUT** : Mise à jour de ressources. ✅
- [ ] **DELETE** : Suppression de ressources. (pas utilisé, il y a beaucoup de modifications mais très peu de suppression)

### **3.3 Manipulation des données par les vues**
- [✅]  Les vues affichent correctement les données transmises par le contrôleur. ✅

---

### **4.1 Design et esthétique**
- [✅]  L’application est jolie et utilise un framework CSS : Oui, utilisation de Bootstrap et MDBootstrap. Il y a plein de couleurs, de graphiques. L'interface utilisateur est agréable.✅

### **3.1 Fonctionnalités non terminées**
Il était prévu de :
- Ajouter plusieurs portefeuilles cryptos
- Ajouter des moyens de paiements (Paypal, etc.)
- Implémenter la suppression de compte

Néanmoins, toutes les fonctionnalités nécessaires au bon fonctionnement de la plateforme sont présentes
