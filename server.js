const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Autoriser le Cross-Origin (essentiel pour tester tes API depuis n'importe où)
app.use(cors());
app.use(express.json());

// Servir l'interface utilisateur statique
app.use(express.static(path.join(__dirname, 'includes/public')));

// --- ROUTES DE VÉRIFICATION DU SERVEUR ---
app.get('/api/status', (req, res) => {
    res.json({
        status: "online",
        author: "Chris st",
        project: "Minato Namikaze Dashboard",
        timestamp: Date.now()
    });
});

// Mock endpoints pour le fonctionnement initial direct (GPT & TikTok)
app.get('/gpt', (req, res) => {
    const query = req.query.q || "Bonjour";
    res.json({
        status: 200,
        category: "ai",
        method: "GET",
        result: `Ceci est une réponse simulée de l'IA pour votre question : "${query}". Configurez vos scripts dans le dossier /api/ai/ pour lier vos clés réelles.`
    });
});

app.get('/download/tiktok', (req, res) => {
    const videoUrl = req.query.url || "";
    res.json({
        status: 200,
        category: "download",
        method: "GET",
        result: {
            title: "Vidéo Minato No Watermark",
            url: videoUrl,
            download_link: "https://i.imgur.com/3XGeH9D.jpeg"
        }
    });
});

// Gestion automatique de l'erreur 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'includes/public/404.html'));
});

app.listen(PORT, () => {
    console.log(`⚡ Éclair Jaune actif sur le port : ${PORT}`);
});

