const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement depuis config.env
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Fonction pour générer des données CSV fictives depuis startDate jusqu'à maintenant
function generateFakeCSVData(
  startYear,
  startMonth,
  startDay,
  startHour,
  startMin,
  startSec
) {
  const headers = 'Timestamp,Device_Name,Unit,Value,Environment,Log_Level\n';

  let csvContent = headers;
  const startDate = new Date(
    startYear,
    startMonth - 1,
    startDay,
    startHour,
    startMin,
    startSec
  );
  const now = new Date();

  // Vérifier que la date de début n'est pas dans le futur
  if (startDate > now) {
    return headers; // Retourner seulement les headers si la date est dans le futur
  }

  // Calculer le nombre d'intervalles de 5 minutes entre startDate et maintenant
  const timeDiffMs = now.getTime() - startDate.getTime();
  const intervalMs = 5 * 60 * 1000; // 5 minutes en millisecondes
  const numberOfIntervals = Math.floor(timeDiffMs / intervalMs);

  console.log(
    `Génération de données depuis ${startDate.toISOString()} jusqu'à ${now.toISOString()}`
  );
  console.log(`Nombre d'intervalles de 5 minutes: ${numberOfIntervals}`);

  // Générer des données pour chaque intervalle de 5 minutes
  for (let i = 0; i <= numberOfIntervals; i++) {
    const currentDate = new Date(startDate.getTime() + i * intervalMs);
    const timestamp = currentDate
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);

    // Données fictives avec variations réalistes
    const humidity = (28 + Math.random() * 2).toFixed(1);
    const airQuality = (2.4 + Math.random() * 0.2).toFixed(1);
    const co = (15.5 + Math.random() * 1).toFixed(1);
    const co2 = (570 + Math.random() * 10).toFixed(1);
    const voc = (4.8 + Math.random() * 0.4).toFixed(1);
    const temperatureRoom1 = (20 + Math.random() * 0.5).toFixed(1);
    const temperatureOutside = (25 + Math.random() * 0.5).toFixed(1);
    const aiSpare1 = (19.5 + Math.random() * 1).toFixed(1);
    const aiSpare2 = (19.5 + Math.random() * 1).toFixed(1);

    // Ajouter les lignes de données
    csvContent += `"${timestamp}","Humidity","%","${humidity}","Air Quality","info"\n`;
    csvContent += `"${timestamp}","P2.5 AirQuality","ppm","${airQuality}","Air Quality","info"\n`;
    csvContent += `"${timestamp}","CO","ppm","${co}","Air Quality","info"\n`;
    csvContent += `"${timestamp}","CO2","ppm","${co2}","Air Quality","info"\n`;
    csvContent += `"${timestamp}","voc","ppm","${voc}","Air Quality","info"\n`;
    csvContent += `"${timestamp}","Temperature Room1","°C","${temperatureRoom1}","Air Quality","info"\n`;
    csvContent += `"${timestamp}","Temperature Outside","°C","${temperatureOutside}","Air Quality","info"\n`;
    csvContent += `"${timestamp}","AI-Spare-1-VIN6","mA","${aiSpare1}","SiteDemoSensors","info"\n`;
    csvContent += `"${timestamp}","AI-Spare-2-VIN7","mA","${aiSpare2}","SiteDemoSensors","info"\n`;
  }

  return csvContent;
}

// Route principale qui simule l'API externe
app.get('/query', (req, res) => {
  try {
    // Récupérer les paramètres de la requête
    const {
      username,
      password,
      logtype,
      format,
      start_year,
      start_month,
      start_day,
      start_hour,
      start_min,
      start_sec,
    } = req.query;

    // Validation des paramètres
    if (!username || !password || !logtype || !format) {
      return res.status(400).json({
        error: 'Paramètres manquants',
        required: ['username', 'password', 'logtype', 'format'],
      });
    }

    // Vérification des credentials avec fallback
    const validUsername = process.env.USERNAME || 'test';
    const validPassword = process.env.PASSWORD || 'test1234';

    if (username !== validUsername || password !== validPassword) {
      return res.status(401).json({
        error: 'Credentials invalides',
      });
    }

    // Vérification du type de log
    if (logtype !== 'DATA') {
      return res.status(400).json({
        error: 'Type de log non supporté',
        supported: ['DATA'],
      });
    }

    // Vérification du format
    if (format !== 'CSV') {
      return res.status(400).json({
        error: 'Format non supporté',
        supported: ['CSV'],
      });
    }

    // Générer les données CSV fictives depuis la date spécifiée jusqu'à maintenant
    const csvData = generateFakeCSVData(
      parseInt(start_year) || 2025,
      parseInt(start_month) || 3,
      parseInt(start_day) || 1,
      parseInt(start_hour) || 0,
      parseInt(start_min) || 0,
      parseInt(start_sec) || 0
    );

    // Définir les headers pour afficher le CSV dans le navigateur
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');

    // Envoyer les données CSV
    res.send(csvData);
  } catch (error) {
    console.error('Erreur lors de la génération des données:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      message: error.message,
    });
  }
});

// Route de compatibilité qui redirige vers /query
app.get('/query.php', (req, res) => {
  // Rediriger vers la route /query avec les mêmes paramètres
  const queryString = new URLSearchParams(req.query).toString();
  const redirectUrl = `/query${queryString ? '?' + queryString : ''}`;
  res.redirect(redirectUrl);
});

// Route de test pour vérifier que l'API fonctionne
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API Faker opérationnelle',
    endpoints: {
      '/query': "Simule l'API externe avec des données CSV fictives",
      '/query.php': 'Redirection vers /query (compatibilité)',
      '/health': "Statut de l'API",
    },
  });
});

// Route racine avec documentation
app.get('/', (req, res) => {
  res.json({
    name: 'Smart Boitier Faker API',
    description: "API faker pour simuler l'API externe de données capteurs",
    usage: {
      endpoint: '/query (ou /query.php pour compatibilité)',
      method: 'GET',
      parameters: {
        username: 'string (ex: test)',
        password: 'string (ex: test1234)',
        logtype: 'string (ex: DATA)',
        format: 'string (ex: CSV)',
        start_year: 'number (ex: 2025)',
        start_month: 'number (ex: 03)',
        start_day: 'number (ex: 01)',
        start_hour: 'number (ex: 00)',
        start_min: 'number (ex: 00)',
        start_sec: 'number (ex: 00)',
      },
    },
    example:
      '/query?username=test&password=test1234&logtype=DATA&format=CSV&start_year=2025&start_month=03&start_day=01&start_hour=00&start_min=00&start_sec=00',
    note: "Les données sont générées depuis la date/heure spécifiée jusqu'à maintenant avec des intervalles de 5 minutes. /query.php redirige automatiquement vers /query.",
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 API Faker démarrée sur le port ${PORT}`);
  console.log(`📊 Endpoint principal: http://localhost:${PORT}/query`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 Documentation: http://localhost:${PORT}/`);
});

module.exports = app;
