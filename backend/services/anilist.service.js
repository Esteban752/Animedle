import axios from "axios";

const ANILIST_API_URL = 'https://graphql.anilist.co';

const query = `query Query($type: MediaType,$mediaId: Int,$sort: [MediaSort],$popularityLesser: Int,$isMain: Boolean,$role: CharacterRole,$format: MediaFormat) {
  Media(type: $type, id: $mediaId, sort: $sort, popularity_lesser: $popularityLesser, format: $format) {
    id
    title {
      english
      romaji
    }
    popularity
    startDate {
      year
    }
    studios(isMain: $isMain) {
      nodes {
        name
      }
    }
    source
    genres
    tags {
      name
    }
    
    characters(role: $role) {
      nodes {
        name {
          full
        }
      }
    }
    synonyms
    coverImage {
      extraLarge
    }
  }
}`;




export class AnilistService {
  async fetchAnime(popularity) {
    console.log("Appel de l'API Anilist avec la query");
    const variables = {
      type: "ANIME",
      sort: "POPULARITY_DESC",
      popularityLesser: popularity,
      isMain: true,
      role: "MAIN",
      format: "TV"
    };

    try {
      const response = await axios.post(ANILIST_API_URL, {
        query: query,
        variables: variables
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      return response.data.data.Media;
    } catch (error) {
      console.error('Erreur lors de la recherche depuis AniList:', error.response?.data || error.message);
      throw error;
    }
  }
}



