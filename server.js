/**
 * Serveur Principal : Minato Namikaze Dashboard
 * Déploiement : Compatible Render, Vercel, Railway (sans modification)
 * Auteur : Chris st
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Autorisations globales (CORS) et parseurs de requêtes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du dossier public (HTML, CSS, Musiques)
app.use(express.static(path.join(__dirname, 'includes/public')));

// Chargement automatique de toutes tes API personnalisées
require('./routes/apiLoader')(app);

// Gestion de la page d'erreur 404 personnalisée
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'includes/public/404.html'));
});

// Lancement du serveur sur le port attribué par l'hébergeur cloud
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`⚡ [MINATO NAMIKAZE SERVER ACTIF] Port : ${PORT}`);
    console.log(`Auteur : Chris st | Prêt pour le déploiement Cloud`);
    console.log(`====================================================`);
});
