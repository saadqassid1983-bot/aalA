import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: !!process.env.GEMINI_API_KEY });
});

// Endpoint to generate a full 5-minute comedy video script
app.post('/api/generate-script', async (req, res) => {
  try {
    const { topic, genre, tone, charactersCount, language } = req.body;

    const userPrompt = `Tu es un scénariste comique d'élite (style Les Nuls, Kaamelott, The Office, Monty Python, Palmashow).
Crée un scénario complet et hilarant pour une vidéo de comédie de EXACTEMENT 5 MINUTES (~300 secondes au total).

Sujet demandé: "${topic || 'Un problème du quotidien qui dégénère en catastrophe cosmique'}"
Genre comique: "${genre || 'Absurde et Parodie'}"
Ton: "${tone || 'Hilarant avec punchlines rythmées et gags visuels'}"
Nombre de personnages principaux: ${charactersCount || 2}
Langue principale: "${language || 'fr'}"

Le scénario doit comporter entre 5 et 7 scènes bien rythmées dont la somme des durées fait environ 300 secondes (5 minutes):
- Scène 1 (0:00 - ~0:45) : L'accroche comique / La situation initiale absurde
- Scène 2 (~0:45 - ~1:30) : La première escalade / Mauvaise décision hilarante
- Scène 3 (~1:30 - ~2:20) : L'incompréhension / Le quiproquo géant
- Scène 4 (~2:20 - ~3:15) : Le chaos total et panique
- Scène 5 (~3:15 - ~4:05) : Le retournement improbable / L'apparition absurde
- Scène 6 (~4:05 - ~4:45) : Le climax d'humour
- Scène 7 (~4:45 - 5:00) : La chute finale inattendue & gag post-générique

Chaque scène doit avoir des répliques de dialogue percutantes avec:
- speaker (nom du personnage)
- text (la réplique drôle et naturelle à lire)
- actorDirection (indication de jeu [entre crochets], ex: [Regarde la caméra d'un air hébété])
- emotion ('neutral', 'shocked', 'happy', 'angry', 'laughing', 'confused', 'smug')
- soundFx ('rimshot', 'sad_trombone', 'laugh_track', 'boing', 'record_scratch', 'crickets', 'dramatic_dun', 'vine_boom', 'applause', 'slap', 'horn' ou null)
- sticker (un petit mot/emoji meme percutant ou null, ex: '💥 BAM', '🤡 GENIUS', '💀 BRUH', '🍕 CHEF')

Les lieux / backgroundKey doivent être choisis parmi:
'office', 'kitchen', 'scifi', 'detective', 'stage', 'park', 'newsroom', 'street'`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: 'Tu es le meilleur réalisateur et scénariste de comédie. Tu réponds UNIQUEMENT en JSON valide selon le schéma requis.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Titre accrocheur et drôle de la vidéo' },
            tagline: { type: Type.STRING, description: 'Sous-titre ou pitch comique en une phrase' },
            synopsis: { type: Type.STRING, description: 'Résumé hilarant de l histoire' },
            genre: { type: Type.STRING },
            totalDurationSeconds: { type: Type.INTEGER, description: 'Durée totale (viser 300 secondes)' },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING, description: 'Description comique du rôle' },
                  voicePitch: { type: Type.NUMBER, description: 'Hauteur de voix entre 0.6 et 1.5' },
                  voiceRate: { type: Type.NUMBER, description: 'Vitesse de débit entre 0.8 et 1.3' },
                  avatarColor: { type: Type.STRING, description: 'Couleur hex de l avatar' },
                  catchphrase: { type: Type.STRING, description: 'Gimmick comique récurrent' }
                },
                required: ['name', 'role', 'voicePitch', 'voiceRate']
              }
            },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  startTime: { type: Type.INTEGER, description: 'Début en secondes (ex: 0, 45, 90...)' },
                  duration: { type: Type.INTEGER, description: 'Durée en secondes de la scène' },
                  location: { type: Type.STRING },
                  backgroundKey: { type: Type.STRING, description: "office, kitchen, scifi, detective, stage, park, newsroom, ou street" },
                  visualGag: { type: Type.STRING, description: 'Gag visuel ou action physique comique' },
                  musicMood: { type: Type.STRING, description: 'goofy, tense_funny, upbeat, ou awkward' },
                  dialogues: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        speaker: { type: Type.STRING },
                        text: { type: Type.STRING },
                        actorDirection: { type: Type.STRING },
                        emotion: { type: Type.STRING, description: "neutral, shocked, happy, angry, laughing, confused, ou smug" },
                        soundFx: { type: Type.STRING, description: "rimshot, sad_trombone, laugh_track, boing, record_scratch, crickets, dramatic_dun, vine_boom, applause, slap, horn" },
                        sticker: { type: Type.STRING }
                      },
                      required: ['speaker', 'text', 'emotion']
                    }
                  }
                },
                required: ['id', 'title', 'startTime', 'duration', 'location', 'backgroundKey', 'visualGag', 'dialogues']
              }
            }
          },
          required: ['title', 'tagline', 'synopsis', 'characters', 'scenes']
        }
      }
    });

    const scriptJson = JSON.parse(response.text || '{}');
    return res.json({ success: true, script: scriptJson });
  } catch (error: any) {
    console.error('Error generating comedy script:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Erreur lors de la génération du script comique'
    });
  }
});

// Endpoint for the "Punch-Up Doctor" - improves punchlines, absurdity or comedic timing
app.post('/api/punchup', async (req, res) => {
  try {
    const { sceneOrText, style } = req.body;

    const prompt = `Tu es un "Script Doctor" comique de génie.
Prends le contenu suivant et réécris-le pour le rendre 10x plus drôle selon le style comique demandé : "${style || 'Absurde maximal et réparties cinglantes'}".

Contenu original à améliorer :
${JSON.stringify(sceneOrText, null, 2)}

Retourne une version améliorée avec de meilleures punchlines, des didascalies hilarantes et des effets sonores comiques aux bons moments.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const result = JSON.parse(response.text || '{}');
    return res.json({ success: true, result });
  } catch (error: any) {
    console.error('Error punching up comedy:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Erreur punch-up'
    });
  }
});

// Endpoint to generate quick comedic ideas/pitches
app.post('/api/generate-ideas', async (req, res) => {
  try {
    const { theme } = req.body;
    const prompt = `Donne 4 concepts originaux et tordants pour une vidéo comique de 5 minutes sur le thème : "${theme || 'La vie de tous les jours'}".
Pour chaque idée, donne :
- title: Titre comique
- hook: L'accroche de départ
- twist: Le retournement absurde à la 3e minute
- climax: La chute à 5:00
- genre: Parodie, Absurde, Sitcom, ou Mockumentary`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              hook: { type: Type.STRING },
              twist: { type: Type.STRING },
              climax: { type: Type.STRING },
              genre: { type: Type.STRING },
            },
            required: ['title', 'hook', 'twist', 'climax', 'genre'],
          }
        }
      }
    });

    const ideas = JSON.parse(response.text || '[]');
    return res.json({ success: true, ideas });
  } catch (error: any) {
    console.error('Error generating comedy ideas:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Erreur idées'
    });
  }
});

// Vite Middleware mounting for Dev or static file serving for Production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Funny Video Studio running on http://0.0.0.0:${PORT}`);
});
