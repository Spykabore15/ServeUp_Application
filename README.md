# ServUp 🍽️ - Application Web de Gestion de Chaîne de Restaurants

ServeUp est une application web conçue pour simplifier la gestion des opérations des chaînes de restaurants. Elle offre une interface utilisateur intuitive pour le suivi des stocks, la gestion du personnel, le traitement des commandes, la relation avec les fournisseurs, la génération de rapports et la configuration des paramètres administratifs.

## ✨ Fonctionnalités Principales

L'application est structurée autour des modules suivants :

- **`login.html`**: Page de connexion sécurisée pour accéder à l'application.
- **`dashboard.html`**: Tableau de bord principal affichant un aperçu des statistiques clés, des alertes et des accès rapides aux différentes sections en fonction du rôle de l'utilisateur.
    - Statistiques générales (nombre d'employés, produits en stock, alertes de stock faible, commandes en cours).
    - Ventes et performances (chiffre d'affaires, commandes complétées, panier moyen).
    - Contenu spécifique au rôle (Admin, Gestionnaire de Stocks, Responsable RH, Employé).
- **`stocks.html`**: Module de gestion des stocks.
    - Visualisation des produits, quantités, seuils d'alerte et statuts.
    - Ajout, modification et suppression de produits (selon les permissions).
    - Indication visuelle des stocks faibles.
- **`employees.html`**: Module de gestion des employés.
    - Liste des employés avec leur poste, statut et rôle.
    - Ajout, modification et suppression d'employés (selon les permissions).
    - Attribution de rôles et gestion des mots de passe (simulé).
    - Fonction de recherche d'employés.
- **`orders.html`**: Module de gestion des commandes clients.
    - Suivi des commandes avec ID, client, date, montant et statut (en cours, livré, annulé).
    - Ajout, modification (statut) et suppression de commandes (selon les permissions).
- **`suppliers.html`**: Module de gestion des fournisseurs.
    - Répertoire des fournisseurs avec leurs coordonnées, personnes à contacter, produits/services offerts et références.
    - Ajout, modification et suppression de fournisseurs.
- **`reports.html`**: Section de rapports et analyses visuelles.
    - Utilise `Chart.js` pour afficher des graphiques interactifs.
    - **Aperçu des Ventes**: Graphique des ventes sur différentes périodes (7 jours, 30 jours, mois actuel/dernier). Export CSV.
    - **Produits Populaires**: Visualisation des produits les plus vendus.
    - **Niveaux des Stocks**: Graphique de l'état actuel des stocks. Export CSV et option pour contacter un fournisseur.
    - **Analyse des Pertes**: Suivi des produits perdus ou gaspillés.
    - **Tendance des Ventes (Simulé)**: Prévisions de ventes simplifiées.
    - Modal pour rechercher et contacter les fournisseurs directement depuis les rapports de stock.
- **`settings.html`**: Page de configuration des paramètres de l'application.
    - **Préférences Générales**: Nom du restaurant (simulé), activation du mode sombre.
    - **Sécurité**: Modification du mot de passe (simulé).
    - **Accessibilité**:
        - Choix de la taille de la police (petite, normale, grande, très grande).
        - Option pour une police plus lisible.
        - Option pour surligner les liens.
        - Option pour un mode contraste élevé.
- **Chatbot d'Assistance**: Intégré sur toutes les pages, le "ServUp Assistant" (via `chatbot.js`) offre une aide contextuelle (simulation).

## 🔧 Structure du Projet

```bash
ServUp/
├── login.html           # Page de connexion
├── dashboard.html       # Tableau de bord principal
├── stocks.html          # Gestion des stocks
├── employees.html       # Gestion des employés
├── orders.html          # Gestion des commandes
├── suppliers.html       # Gestion des fournisseurs
├── reports.html         # Rapports et analyses
├── settings.html        # Paramètres de l'application
├── css/
│   └── style.css        # Feuille de style principale (inclut des styles pour le mode sombre, l'accessibilité, etc.)
├── js/
│   ├── login.js         # Logique pour la page de connexion
│   ├── dashboard.js     # Logique pour le tableau de bord et affichage dynamique
│   ├── stocks.js        # Logique pour la gestion des produits et des stocks
│   ├── employees.js     # Logique pour la gestion du personnel
│   ├── orders.js        # Logique pour la gestion des commandes clients
│   ├── suppliers.js     # Logique pour la gestion des fournisseurs
│   ├── reports.js       # Logique pour la génération des graphiques et des rapports
│   ├── settings.js      # Logique pour la gestion des préférences et paramètres
│   ├── auth.js          # Fonctions d'authentification, gestion des sessions et des permissions par rôle
│   ├── chatbot.js       # Logique du chatbot d'assistance
│   └── mockData.js      # Données simulées pour le développement et les tests (utilisateurs, produits, commandes, etc.)
├── img/
│   └── logo.png         # Logo de l'application
└── README.md            # Ce fichier
```

## ▶️ Comment Tester

1.  Clonez le projet ou téléchargez les fichiers sur votre machine locale.
2.  Ouvrez le fichier `ServUp/login.html` dans un navigateur web moderne (Chrome, Firefox, Edge, Safari).
3.  Connectez-vous avec l'un des comptes utilisateurs de test suivants. Les mots de passe sont sensibles à la casse.

## 👥 Identifiants de Test

| Rôle                 | Nom d'utilisateur | Mot de passe    |
| -------------------- | ----------------- | --------------- |
| Administrateur       | `admin`           | `adminpassword` |
| Responsable Stocks   | `stockmanager`    | `stockpassword` |
| Responsable RH       | `hrmanager`       | `hrpassword`    |
| Employé              | `employee`        | `employeepassword`|

*(Note: D'autres rôles et utilisateurs peuvent être présents dans `mockData.js`)*

## 👤 Rôles et Permissions (Exemples)

-   **`admin`**: Accès complet à tous les modules et fonctionnalités (visualisation, création, modification, suppression).
-   **`responsable_stocks` (`stockmanager`)**: Accès principalement à la gestion des stocks (`stocks.html`). Peut visualiser d'autres sections avec des droits limités.
-   **`responsable_employes` (`hrmanager`)**: Accès principalement à la gestion des employés (`employees.html`). Peut visualiser d'autres sections avec des droits limités.
-   **`employe`**: Accès en lecture seule à la plupart des données. Certaines sections peuvent être restreintes.

Les permissions exactes sont gérées dynamiquement par `auth.js` et les scripts spécifiques à chaque page, en affichant/masquant les éléments interactifs (boutons, formulaires) et en limitant les actions.

## 🚧 Notes Techniques

-   **Client-Side Uniquement**: Ce projet est entièrement développé en HTML, CSS et JavaScript pur (Vanilla JS), sans aucun framework JavaScript externe (à l'exception de Chart.js pour les graphiques).
-   **Simulation de Données**: Aucune base de données réelle n'est utilisée. Toutes les données (utilisateurs, produits, commandes, etc.) sont simulées et stockées localement dans le navigateur via `localStorage` et initialisées depuis `mockData.js`. Les modifications sont persistantes dans la session du navigateur.
-   **MVP (Minimum Viable Product)**: Il s'agit d'une version initiale visant à démontrer les fonctionnalités principales.
-   **Accessibilité**: Des efforts ont été faits pour inclure des options d'accessibilité (taille de police, contraste, etc.) dans la section des paramètres.
-   **Responsive Design**: Des media queries basiques sont présentes dans `style.css` pour une meilleure expérience sur différentes tailles d'écran, mais une optimisation plus poussée est prévue.

## 📌 Fonctionnalités Prévues (À Venir)

-   **Backend et Base de Données**: Intégration d'un backend (ex: Node.js/Express) et d'une base de données (ex: MongoDB, PostgreSQL) pour une persistance réelle des données.
-   **Authentification Robuste**: Mise en place d'une authentification sécurisée avec tokens (ex: JWT).
-   **Amélioration du Responsive Design**: Optimisation complète pour les appareils mobiles et tablettes.
-   **Rapports Avancés**: Développement de statistiques et de rapports plus détaillés et personnalisables.
-   **Notifications**: Système de notifications en temps réel pour les alertes de stock, nouvelles commandes, etc.
-   **Internationalisation (i18n)**: Support pour plusieurs langues.
-   **Tests Unitaires et d'Intégration**: Ajout de tests pour assurer la qualité du code.

## 📂 Licence

Ce projet est proposé à titre pédagogique et comme démonstration de compétences. Pour une utilisation commerciale ou professionnelle, veuillez considérer les limitations actuelles (pas de backend, sécurité simulée) et contacter les développeurs pour discuter d'une version plus robuste et sécurisée. 
