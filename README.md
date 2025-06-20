# Smart Boitier Faker API

Une API faker qui simule l'API externe de données capteurs et renvoie des données CSV fictives.

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur
npm start

# Ou en mode développement avec auto-reload
npm run dev
```

## 📊 Utilisation

### Endpoint principal

```
GET /query.php
```

### Paramètres requis

- `username` (string) - Nom d'utilisateur (ex: test)
- `password` (string) - Mot de passe (ex: test1234)
- `logtype` (string) - Type de log (ex: DATA)
- `format` (string) - Format de sortie (ex: CSV)

### Paramètres optionnels

- `start_year` (number) - Année de début (défaut: 2025)
- `start_month` (number) - Mois de début (défaut: 3)
- `start_day` (number) - Jour de début (défaut: 1)
- `start_hour` (number) - Heure de début (défaut: 0)
- `start_min` (number) - Minute de début (défaut: 0)
- `start_sec` (number) - Seconde de début (défaut: 0)

### Exemple d'utilisation

```bash
curl "http://localhost:3000/query.php?username=test&password=test1234&logtype=DATA&format=CSV&start_year=2025&start_month=03&start_day=01&start_hour=00&start_min=00&start_sec=00"
```

### Format de réponse

L'API renvoie un fichier CSV avec les colonnes suivantes :

- `Timestamp` - Horodatage de la mesure
- `Device_Name` - Nom du capteur
- `Unit` - Unité de mesure
- `Value` - Valeur mesurée
- `Environment` - Environnement du capteur
- `Log_Level` - Niveau de log

### Exemple de données générées

```csv
Timestamp,Device_Name,Unit,Value,Environment,Log_Level
"2025-03-01 00:02:40","Humidity","%","28.575600","Air Quality","info"
"2025-03-01 00:02:40","P2.5 AirQuality","ppm","2.500000","Air Quality","info"
"2025-03-01 00:02:40","CO","ppm","15.792800","Air Quality","info"
"2025-03-01 00:02:40","CO2","ppm","573.729980","Air Quality","info"
"2025-03-01 00:02:40","voc","ppm","5.000000","Air Quality","info"
"2025-03-01 00:02:40","Temperature","%B0C","20.091600","Air Quality","info"
"2025-03-01 00:02:40","AI-Spare-1-VIN6","mA","20.000000","SiteDemoSensors","info"
"2025-03-01 00:02:40","AI-Spare-2-VIN7","mA","20.000000","SiteDemoSensors","info"
```

## 🔧 Endpoints disponibles

- `GET /` - Documentation de l'API
- `GET /health` - Statut de l'API
- `GET /query.php` - Endpoint principal pour récupérer les données CSV

## 🛠️ Configuration

Le serveur démarre par défaut sur le port 3000. Vous pouvez modifier le port en définissant la variable d'environnement `PORT` :

```bash
PORT=8080 npm start
```

## 📝 Notes

- Les données générées couvrent 24 heures avec des intervalles de 5 minutes
- Les valeurs sont générées avec des variations réalistes autour des valeurs de référence
- L'API simule la validation des credentials et des paramètres
- Les données sont générées dynamiquement à chaque requête
