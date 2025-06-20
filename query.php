<?php
/**
 * Script de redirection pour compatibilité.
 *
 * Ce script intercepte les appels vers /query.php et redirige le navigateur
 * vers la route /query avec les mêmes paramètres. La redirection est gérée
 * par le serveur Node.js sous-jacent.
 *
 * Utilise une redirection 307 (Temporary Redirect) pour garantir que la méthode
 * de la requête (GET) et le corps sont conservés.
 */

// Reconstruit l'URL de destination en conservant les paramètres de la requête.
$queryString = $_SERVER['QUERY_STRING'];
$redirectUrl = '/query' . (!empty($queryString) ? '?' . $queryString : '');

// Envoie l'en-tête de redirection au navigateur.
header('Location: ' . $redirectUrl, true, 307);

// Stoppe l'exécution du script.
exit();
?> 