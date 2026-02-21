/**
 * Recherche des animes par nom avec correspondance floue
 * @param {string} searchTerm - Le terme de recherche
 * @param {Array} animesJSON - Tableau d'objets anime
 * @param {number} threshold - Seuil de similarité (0-1, défaut: 0.6)
 * @param {number} maxResults - Nombre maximum de résultats (défaut: 10)
 * @returns {Array} - Tableau d'animes correspondants triés par pertinence
 */
export function searchAnimeByName(searchTerm, animesJSON, threshold = 0.6, maxResults = 10) {
  if (!searchTerm || searchTerm.trim() === '') {
    return [];
  }

  const normalizedSearch = normalizeTitle(searchTerm);
  const results = [];

  for (const anime of animesJSON) {
    // Chercher dans tous les champs de titre possibles
    const titleEnglish = anime.name || anime.title?.english || '';
    const titleRomaji = anime.romaji || anime.title?.romaji || '';
    const synonyms = anime.synonyms || [];

    const titlesToCheck = [
      titleEnglish,
      titleRomaji,
      ...synonyms
    ].filter(Boolean); // Enlever les valeurs vides

    let bestMatch = {
      anime: anime,
      matchedTitle: '',
      similarity: 0,
      matchType: ''
    };

    for (const title of titlesToCheck) {
      // 1. Correspondance exacte (insensible à la casse)
      if (title.toLowerCase() === searchTerm.toLowerCase()) {
        bestMatch.similarity = 1.0;
        bestMatch.matchedTitle = title;
        bestMatch.matchType = 'exact';
        break;
      }

      // 2. Contient le terme de recherche
      if (title.toLowerCase().includes(searchTerm.toLowerCase())) {
        const containsSimilarity = 0.9;
        if (containsSimilarity > bestMatch.similarity) {
          bestMatch.similarity = containsSimilarity;
          bestMatch.matchedTitle = title;
          bestMatch.matchType = 'contains';
        }
      }

      // 3. Similarité Jaccard
      const normalizedTitle = normalizeTitle(title);
      const jaccardSim = jaccardSimilarity(normalizedSearch, normalizedTitle);
      
      if (jaccardSim > bestMatch.similarity) {
        bestMatch.similarity = jaccardSim;
        bestMatch.matchedTitle = title;
        bestMatch.matchType = 'fuzzy';
      }

      // 4. Distance de Levenshtein normalisée
      const levenshteinSim = levenshteinSimilarity(
        normalizedSearch, 
        normalizedTitle
      );
      
      if (levenshteinSim > bestMatch.similarity) {
        bestMatch.similarity = levenshteinSim;
        bestMatch.matchedTitle = title;
        bestMatch.matchType = 'levenshtein';
      }
    }

    // Ajouter si le score dépasse le seuil
    if (bestMatch.similarity >= threshold) {
      results.push(bestMatch);
    }
  }

  // Trier par similarité décroissante
  results.sort((a, b) => b.similarity - a.similarity);

  // Limiter le nombre de résultats
  return results.slice(0, maxResults);
}

/**
 * Recherche simple (commence par)
 */
export function searchAnimeStartsWith(searchTerm, animesJSON, maxResults = 10) {
  if (!searchTerm || searchTerm.trim() === '') {
    return [];
  }

  const lowerSearch = searchTerm.toLowerCase();
  const results = [];

  for (const anime of animesJSON) {
    const titleEnglish = anime.name || anime.title?.english || '';
    const titleRomaji = anime.romaji || anime.title?.romaji || '';

    if (titleEnglish.toLowerCase().startsWith(lowerSearch)) {
      results.push({
        anime: anime,
        matchedTitle: titleEnglish,
        matchType: 'starts_with',
        similarity: 0.95
      });
    } else if (titleRomaji.toLowerCase().startsWith(lowerSearch)) {
      results.push({
        anime: anime,
        matchedTitle: titleRomaji,
        matchType: 'starts_with',
        similarity: 0.95
      });
    }
  }

  return results.slice(0, maxResults);
}

/**
 * Recherche avec pondération (favorise les titres populaires)
 */
export function searchAnimeWeighted(searchTerm, animesJSON, threshold = 0.6, maxResults = 10) {
  const results = searchAnimeByName(searchTerm, animesJSON, threshold, 100);

  // Pondérer par popularité
  results.forEach(result => {
    const popularity = result.anime.popularity || 0;
    const popularityBonus = Math.log10(popularity + 1) / 10; // Bonus logarithmique
    result.weightedScore = result.similarity + popularityBonus;
  });

  // Retrier par score pondéré
  results.sort((a, b) => b.weightedScore - a.weightedScore);

  return results.slice(0, maxResults);
}

/**
 * Distance de Levenshtein (nombre de modifications pour transformer une chaîne en une autre)
 */
function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = [];

  // Initialiser la matrice
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Remplir la matrice
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // Suppression
        matrix[i][j - 1] + 1,      // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Similarité basée sur la distance de Levenshtein (0-1)
 */
function levenshteinSimilarity(str1, str2) {
  const distance = levenshteinDistance(str1, str2);
  const maxLen = Math.max(str1.length, str2.length);
  
  if (maxLen === 0) return 1.0;
  
  return 1 - (distance / maxLen);
}

/**
 * Similarité de Jaccard (intersection / union des mots)
 */
function jaccardSimilarity(str1, str2) {
  const words1 = new Set(str1.split(' ').filter(w => w.length > 0));
  const words2 = new Set(str2.split(' ').filter(w => w.length > 0));

  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);

  if (union.size === 0) return 0;

  return intersection.size / union.size;
}

/**
 * Normaliser un titre pour la comparaison
 */
function normalizeTitle(title) {
  return title
    .toLowerCase()
    .normalize("NFD") // Décomposer les accents
    .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
    .replace(/[^a-z0-9\s]/g, " ") // Enlever caractères spéciaux
    .replace(/\s+/g, " ") // Supprimer doubles espaces
    .trim();
}

/**
 * Filtre multiple (par genre, année, studio, etc.)
 */
export function filterAnimes(animesJSON, filters = {}) {
  let filtered = [...animesJSON];

  // Filtre par genre
  if (filters.genre) {
    filtered = filtered.filter(anime => {
      const genres = anime.genres || [];
      return genres.includes(filters.genre);
    });
  }

  // Filtre par année
  if (filters.year) {
    filtered = filtered.filter(anime => anime.year === filters.year);
  }

  // Filtre par année min et max
  if (filters.minYear) {
    filtered = filtered.filter(anime => anime.year >= filters.minYear);
  }
  if (filters.maxYear) {
    filtered = filtered.filter(anime => anime.year <= filters.maxYear);
  }

  // Filtre par studio
  if (filters.studio) {
    filtered = filtered.filter(anime => anime.studio === filters.studio);
  }

  // Filtre par source
  if (filters.source) {
    filtered = filtered.filter(anime => anime.source === filters.source);
  }

  // Filtre par popularité minimum
  if (filters.minPopularity) {
    filtered = filtered.filter(anime => 
      (anime.popularity || 0) >= filters.minPopularity
    );
  }

  return filtered;
}