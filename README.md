# LateCrypto 🚀💸

LateCrypto est une plateforme de trading qui permet d'acheter, vendre, envoyer, retirer, échanger des cryptomonnaies.




# **README - Évaluation du Projet**

## **1. Fonctionnalités demandées**

### **1.1 Gestion d’entités**

- **Nombre d'entités** :
  - Le projet gère **au moins 5 entités** distinctes.✅
    - Exemple d’entités : `User`, `Wallet`, `Transaction`, `Cryptocurrency`, `Profile`, `CryptoHolding`. 
      
- **Relations implémentées :**
  - **OneToOne** : `User` <-> `Profile` ✅
  - **OneToMany / ManyToOne** : `User` <-> `Transaction` ✅
  - **ManyToMany** : `Transaction` <-> `CryptoHolding` ✅
  - 

### **1.2 Association/dissociation graphique des entités**

- **Interface utilisateur** permettant de :✅
  - Associer ou dissocier graphiquement des relations **1-N** et **N-N**.
  - Exemple : Ajout/suppression de cryptomonnaies dans un portefeuille.

### **1.3 Logique métier**
- L’application inclut une logique métier avancée, au-delà des simples opérations CRUD.
  - Exemple : Calcul des variations en temps réel de la valeur du portefeuille, des fluctuations de prix des différentes cryptomonnaies. ✅
  - Validation des transactions (exemple : vérification des fonds disponibles avant un retrait, un envoi, un échange; vérification de solde avant achat de cryptomonnaies).✅

### **1.4 Repository Git**
- Le code source est disponible dans un repository Git (à préciser : Github/Gitlab). ✅
  - **Commits réguliers** : Oui (étant l'unique membre du groupe). ✅

---

## **2. Fonctionnalités techniques**

### **2.1 Manipulation des entités en BDD**

- **CRUD** ✅
  - [ ] **Insérer** une entité en base de données (BDD). (ajout d'un nouvel utilisateur, d'une nouvelle cryptomonnaie, etc.)
  - [ ] **Mettre à jour** une entité existante en BDD.   (mise à jour de prix, de solde, des capitalisation boursières etc..)
  - [ ] **Supprimer** une entité en BDD. (utilisé pour des test avec postman, mais n'a pas été mis en application concrètement)
  - [ ] **Chercher** une entité dans la BDD. (recherche d'un user déja inscrit, d'une crypto, etc.)

### **2.2 Liaison des entités** ✅
- [ ] **Lier deux entités** en BDD (exemple : associer un portefeuille à un utilisateur).
- [ ] **Créer un lien entre deux entités** à partir de l’interface utilisateur, lors de l'achat d'une cryptomonnaie par exemple

---


### **3.1 Design pattern MVC**

- [ ] **Modèle** : Gestion des entités et logique métier. ✅
- [ ] **Vue** : Les pages affichent les données transmises par le contrôleur. ✅
- [ ] **Contrôleur** : Réception et traitement des requêtes. ✅

### **3.2 Utilisation des méthodes HTTP**
- [ ] **GET** : Récupération de données. ✅
- [ ] **POST** : Création de ressources. ✅
- [ ] **PUT** : Mise à jour de ressources. ✅
- [ ] **DELETE** : Suppression de ressources. (pas utilisé)

### **3.3 Manipulation des données par les vues**
- [ ] Les vues affichent correctement les données transmises par le contrôleur. ✅

---

### **4.1 Design et esthétique**
- [ ] L’application utilise un framework CSS : Oui, utilisation de Bootsrap et MDBootstrap.
- [ ] L’interface utilisateur est agréable et intuitive.



