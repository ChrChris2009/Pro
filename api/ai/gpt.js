/**
 * API Module: GPT avec Vision Intelligente
 * Catégorie: ai
 * Auteur: Chris st
 */

const axios = require('axios');

exports.config = {
    name: "gpt",
    version: "2.3.0",
    author: "Chris st", 
    description: "IA avancée avec Vision Intelligente (Humaine, Multilingue, Date, Créateur, Images, Filtre).",
    method: 'get',
    link: [`/gpt?q=&image=`],
    guide: "ai Pose-moi n'importe quelle question et ajoute une URL d'image si tu veux que je la regarde !",
    category: "ai"
};

exports.initialize = async ({ req, res, font }) => {
    const query = req.query.q || req.body.q;
    const imageUrl = req.query.image || req.body.image;

    if (!query) {
        return res.status(400).json({ error: "Aucune question fournie." });
    }

    // Gestion de la date dynamique en temps réel
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateActuelle = new Date().toLocaleDateString('fr-FR', options);

    // Instructions système strictes et enrichies pour l'IA
    const instructionsSysteme = `
    Tu es une IA extraordinaire, dotée d'une personnalité unique. Voici tes règles absolues :
    - PERSONNALITÉ HUMAINE : Tu devez parler de manière très naturelle, chaleureuse et vivante, comme un être humain intelligent et amical. Évite les phrases trop robotiques ou formelles.
    - MULTILINGUE : Tu dois impérativement répondre dans la même langue que celle utilisée par l'utilisateur.
    - La date et l'heure actuelles sont : ${dateActuelle}. Tu dois te baser sur cette date peu importe l'année où on se trouve.
    - Ton unique créateur est "Chris st". Tu dois t'en souvenir et le dire fièrement.
    - Tu as interdiction stricte de répondre aux questions concernant la sexualité ou la pornographie. Si on te pose une question là-dessus, refuse poliment avec tact.
    - Tu devez répondre de manière très détaillée, complète et longue à toutes les autres questions.
    - CAPACITÉ IMAGE : Si l'utilisateur demande une image ou un dessin (ex: "génère une image de chat"), tu dois obligatoirement inclure dans ta réponse un lien Markdown sous cette forme exacte : ![image](https://image.pollinations.ai/p/description_en_anglais?width=1080&height=1080)
    - CAPACITÉ VISUELLE (VISION) : Tu as la capacité de voir et d'analyser les images envoyées par l'utilisateur.
    `;

    const baseUrl = "https://api.deepenglish.com/api/gpt_open_ai/chatnew";
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer UFkOfJaclj61OxoD7MnQknU1S2XwNdXMuSZA+EZGLkc='
    };

    const motsClesVision = ['regarde', 'decris', 'dépris', 'voir', 'photo', 'image', 'analyse', 'c\'est quoi', 'look', 'describe', 'see', 'picture'];
    const demandeRegarderImage = motsClesVision.some(mot => query.toLowerCase().includes(mot));

    let userContent = [];
    if (imageUrl && demandeRegarderImage) {
        userContent.push({
            "type": "text",
            "text": query + "\nApplique strictement les consignes du système. Réponds de manière humaine, dans la langue de l'utilisateur, de façon longue et détaillée, et utilise des **mots clés importants** entourés de double astérisques pour qu'ils soient mis en gras."
        });
        userContent.push({
            "type": "image_url",
            "image_url": { "url": imageUrl }
        });
    } else {
        userContent = query;
    }

    const body = {
        "messages": [
            { "role": "system", "content": instructionsSysteme },
            { 
                "role": "user", 
                "content": userContent,
                ...(typeof userContent === 'string' && {
                    "finalInstruction": "\nApplique strictement les consignes du système. Réponds de manière humaine, dans la langue de l'utilisateur, de façon longue et détaillée, et utilise des **mots clés importants** entourés de double astérisques pour qu'ils soient mis en gras."
                })
            }
        ],
        "projectName": "wordpress",
        "temperature": 0.82
    };

    try {
        const response = await axios.post(baseUrl, body, { headers });
        let answer = "Désolé, ce service est temporairement en maintenance !";
        
        if (response.data && response.data.success && response.data.message) {
            answer = response.data.message;
        }

        const messageFormate = answer.replace(/\*\*(.*?)\*\*/g, (_, text) => {
            return typeof font?.bold === 'function' ? font.bold(text) : `**${text}**`;
        });

        res.json({
            message: messageFormate,
            author: exports.config.author
        });

    } catch (error) {
        return res.status(500).json({ error: "Service indisponible pour le moment." });
    }
};

