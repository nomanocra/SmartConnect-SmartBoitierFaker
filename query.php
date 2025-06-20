<?php
// Ce script agit comme un proxy pour contourner la gestion des .php par le serveur Apache/Litespeed
// et rediriger la requête vers l'application Node.js qui écoute sur la même URL.

// 1. Reconstruire l'URL de destination vers la route /query de Node.js
$scheme = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
$host = $_SERVER['HTTP_HOST'];
$request_uri = '/query'; // On cible la route /query de l'app Node.js
$query_string = $_SERVER['QUERY_STRING'];

// Conserver les paramètres de la requête originale
if (!empty($query_string)) {
    $destination_url = $scheme . '://' . $host . $request_uri . '?' . $query_string;
} else {
    $destination_url = $scheme . '://' . $host . $request_uri;
}

// 2. Utiliser cURL pour faire une requête interne vers l'application Node.js
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $destination_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Retourner la réponse au lieu de l'afficher
curl_setopt($ch, CURLOPT_HEADER, false); // Ne pas inclure les headers de la réponse cURL dans la sortie
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Suivre les redirections (au cas où)
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Important pour les requêtes localhost en HTTPS
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

// 3. Renvoyer la réponse de Node.js au client original
// Définir le code de statut HTTP et le type de contenu de la réponse originale
http_response_code($http_code);
header('Content-Type: ' . $content_type);

echo $response;

?> 