/**
 * Module : API Loader Dynamique
 * Description : Scanne l'arborescence du dossier api/ et enregistre les routes
 * Auteur : Chris st
 */

const fs = require('fs');
const path = require('path');

module.exports = function(app) {
    const apiDirectory = path.join(__dirname, '../api');
    const subCategories = ['ai', 'download', 'image', 'tools', 'search', 'system'];
    
    // Liste globale accessible par le tableau de bord HTML
    global.apiList = [];

    subCategories.forEach(category => {
        const categoryPath = path.join(apiDirectory, category);
        
        // Si le sous-dossier existe, on lit son contenu
        if (fs.existsSync(categoryPath)) {
            const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
            
            files.forEach(file => {
                const filePath = path.join(categoryPath, file);
                try {
                    const apiModule = require(filePath);
                    
                    // Vérification stricte du format (comme ton exemple exporté)
                    if (apiModule.config && typeof apiModule.initialize === 'function') {
                        const config = apiModule.config;
                        const routePath = `/${config.name}`;
                        const method = config.method.toLowerCase();

                        // Liaison de la route Express dynamique (GET, POST, etc.)
                        app[method](routePath, (req, res) => {
                            const font = {
                                bold: (text) => `**${text}**`
                            };
                            apiModule.initialize({ req, res, font });
                        });

                        // Ajout à la liste centrale du Dashboard
                        global.apiList.push({
                            name: config.name,
                            version: config.version || "1.0.0",
                            author: config.author || "Chris st",
                            description: config.description || "",
                            method: config.method.toUpperCase(),
                            link: config.link || [`/${config.name}`],
                            guide: config.guide || "",
                            category: config.category || category
                        });
                        
                        console.log(`[⚡ MINATO LOAD] Route activée : ${routePath} [${category.toUpperCase()}]`);
                    }
                } catch (error) {
                    console.error(`[❌ ERROR] Impossible de charger le fichier ${file}:`, error.message);
                }
            });
        }
    });

    // Endpoint API renvoyant la liste structurée au Dashboard
    app.get('/api/list', (req, res) => {
        res.json({
            author: "Chris st",
            apis: global.apiList
        });
    });
};

