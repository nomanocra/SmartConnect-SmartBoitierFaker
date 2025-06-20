<?php
// Fichier de redirection pour compatibilité avec l'API originale
// Redirige vers la route /query de l'application Node.js

// Récupérer tous les paramètres de la requête
$query_params = $_GET;

// Construire l'URL de redirection
$redirect_url = '/query';

// Ajouter les paramètres s'il y en a
if (!empty($query_params)) {
    $redirect_url .= '?' . http_build_query($query_params);
}

// Effectuer la redirection
header('Location: ' . $redirect_url, true, 302);
exit();
?> 