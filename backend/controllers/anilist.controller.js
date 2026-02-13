import { pool } from '../db/postgres.js'
import { AnilistService } from '../services/anilist.service.js';
import fs from 'fs';

const anilistService = new AnilistService();

export class AnilistController {
 
  async importAnime(req, res) {
    const count = 300;
    

    const results = {
      success: [],
      errors: [],
      duplicates: [],
      total: count
    };

    
    try {
      let popularity = 10000000;
      const animeNameIn = [];
      for (let i = 0; i < count; i++) {
        try {
          console.log(`[${i + 1}/${count}] Récupération de l'anime avec popularity < ${popularity}...`);

          // 1. Récupérer l'anime depuis AniList
          const animeData = await anilistService.fetchAnime(popularity);
          console.log(`anime actuel : ${animeData.title?.english}`)
          // creer un tableau contenant tous les noms deja dans la bd
          

          // 2. Vérifier si l'anime existe déjà
          const existingAnime = await pool.query(
            'SELECT id FROM anime WHERE anilistid = $1',
            [animeData.id]
          );
          if (existingAnime.rows.length == 0) {
            // 3. Préparer les données pour l'insertion
            let anilistid = animeData.id;
            let name = animeData.title?.english || null;
            if (name == null && animeData.title?.romaji != null) {
              name = animeData.title?.romaji;
            }
            let j = 0;
            if (animeNameIn[0] == undefined) {
              animeNameIn.push(name);
              j = 1;
            }
            
            while (j < animeNameIn.length && !areAnimeTitlesDuplicate(name,animeNameIn.at(j))) {
              j++;
            }
            if (j >= animeNameIn.length) {
              animeNameIn.push(name);

              let romaji = animeData.title?.romaji || null;
              popularity = animeData.popularity || 0;
              let year = animeData.startDate?.year || null;
              let studio = animeData.studios?.nodes?.[0]?.name || null;
              let source = animeData.source || null;
              let genres = animeData.genres || [];
              let tags = animeData.tags?.map(tag => tag.name) || [];
              let characters = animeData.characters?.nodes?.map(char => char.name.full) || [];
              let synonyms = animeData.synonyms || [];
              let cover = animeData.coverImage?.extraLarge || null;
              // 4. Insérer dans la base de données
              let insertQuery = `
                INSERT INTO anime (
                  anilistid, 
                  name, 
                  romaji, 
                  year, 
                  studio, 
                  source, 
                  genres, 
                  tags, 
                  characters,
                  synonyms,
                  cover,
                  popularity
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12)
                RETURNING *
              `;

              let result = await pool.query(insertQuery, [
                anilistid,
                name,
                romaji,
                year,
                studio,
                source,
                JSON.stringify(genres),
                JSON.stringify(tags),
                JSON.stringify(characters),
                JSON.stringify(synonyms),
                cover,
                popularity
              ]);

              res.status(201).json({
                message: 'Anime importé avec succès',
                anime: result.rows[0]
              });
            }
            else {
              popularity = animeData.popularity || 0;
              let data = name + " | " + animeNameIn.at(j) + "\n";
              console.log(data);
              fs.appendFile('anime-reco.txt', data, err => {
                if (err) {
                  console.error(err);
                }
              });
            }
          }
          

        } catch(error) {
          console.error(`✗ [${i + 1}/${count}] Erreur:`, error.message);
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      console.log(animeNameIn);
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      res.status(500).json({ 
        error: 'Erreur lors de l\'importation de l\'anime',
        details: error.message 
      });
    }
    
  }

  async getAllAnimes(req, res) {
    console.log("Appel de la fonction getAllAnimes du controller");
    try {
      const result = await pool.query('SELECT * FROM anime ORDER BY popularity DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des animes:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

function normalizeTitle(title) {
  let titleNormalized = title.toLowerCase();
  titleNormalized = titleNormalized.normalize("NFD") // enlève accents
  titleNormalized = titleNormalized.replace(/[\u0300-\u036f]/g, "")
  titleNormalized = titleNormalized.replace(/[^a-z0-9\s]/g, " ") // enlève caractères spéciaux
  titleNormalized = titleNormalized.replace(/\s+/g, " ") // supprime doubles espaces
  titleNormalized = titleNormalized.trim();
  return titleNormalized;
}

function stripSuffixes(title) {
  const suffixPatterns = [
    /\bseason\s?\d+\b/g,
    /\bpart\s?\d+\b/g,
    /\bcour\s?\d+\b/g,
    /\bfinal\b/g,
    /\b\d+(st|nd|rd|th)\sseason\b/g,
    /\b(tv|ova|ona|movie)\b/g,
    /\bii\b/g,
    /\biii\b/g,
    /\biv\b/g,
    /\bt\b$/g, 
    /\bs\b$/g
  ];

  let cleaned = title;
  for (const pattern of suffixPatterns) {
    cleaned = cleaned.replace(pattern, "");
  }

  return cleaned.replace(/\s+/g, " ").trim();
}


function jaccardSimilarity(a, b) {
  const setA = new Set(a.split(" "));
  const setB = new Set(b.split(" "));

  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  return intersection.size / union.size;
}


function areAnimeTitlesDuplicate(title1, title2, threshold = 0.8) {
  const clean1 = stripSuffixes(normalizeTitle(title1));
  const clean2 = stripSuffixes(normalizeTitle(title2));

  const similarity = jaccardSimilarity(clean1, clean2);

  return similarity >= threshold;
}

