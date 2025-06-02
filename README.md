ServeUp 🍽️
Web Application for Restaurant Chain Management

ServeUp est une application web légère conçue pour faciliter la gestion des chaînes de restaurants. Elle propose une interface simple pour le suivi des stocks, la gestion des employés, le traitement des commandes et la configuration des paramètres administratifs.

🔧 Project Structure

Modifier
├── login.html           # Page de connexion
├── dashboard.html       # Tableau de bord
├── stocks.html          # Gestion des stocks
├── employees.html       # Gestion des employés
├── orders.html          # Gestion des commandes
├── settings.html        # Paramètres de l'application
├── css/
│   └── style.css        # Feuille de style principale
├── js/
│   ├── login.js         # Logique de connexion
│   ├── dashboard.js     # Logique du tableau de bord
│   ├── stocks.js        # Logique de gestion des stocks
│   ├── employees.js     # Logique de gestion des employés
│   ├── orders.js        # Logique de gestion des commandes
│   ├── settings.js      # Logique des paramètres
│   ├── auth.js          # Gestion de l'authentification et des sessions
│   ├── utils.js         # Fonctions utilitaires
│   └── mockData.js      # Données simulées pour les tests
▶️ How to Test
Cloner le projet ou le télécharger sur votre machine.

Ouvrir le fichier login.html dans un navigateur web moderne.

Se connecter avec l’un des comptes utilisateurs de test suivants :

👥 Test Credentials
Role	Username	Password
Admin	admin	adminpassword
Stock Manager	stockmanager	stockpassword
HR Manager	hrmanager	hrpassword
Employee	employee	employeepassword

👤 User Roles & Permissions
admin : Accès complet à tous les modules (stocks, employés, commandes, paramètres).

responsable_stocks : Accès uniquement à la gestion des stocks.

responsable_employes : Accès uniquement à la gestion des employés.

employe : Accès en lecture seule à toutes les données.

🚧 Notes Techniques
Ce projet utilise HTML, CSS et JavaScript pur (sans framework).

Aucune base de données réelle n’est utilisée : les données sont simulées via mockData.js.

Il s’agit d’un MVP (Minimum Viable Product) destiné à évoluer vers une application plus robuste intégrant backend, authentification sécurisée et base de données.

📌 À venir
Intégration d’une base de données (MongoDB ou PostgreSQL).

Création d’un backend en Node.js / Express.

Authentification sécurisée avec tokens JWT.

Responsive design pour mobile et tablette.

Statistiques et rapports avancés sur les performances du restaurant.

📂 Licence
Ce projet est proposé à titre pédagogique. Pour une utilisation commerciale ou professionnelle, merci de contacter les développeurs.
