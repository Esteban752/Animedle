import { getAnimebyDate, newRandomAnime, insertDailyAnime } from '../services/dailyGame.service.js';


export async function getDailyAnime(req, res) {
    try {
        const date = req.params.date ?? new Date();
        const dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        const dailyAnime = await getAnimebyDate(dateFormat);
        res.json(dailyAnime)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'DB error' })
    }
}

export async function createRandomAnime(req, res) {
    try {
        const anime = await newRandomAnime();
        const date = new Date();
        const dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        insertDailyAnime(anime,dateFormat);
        res.json(anime);
    } catch (error) {
        console.error(err)
        res.status(500).json({ error: 'DB error' })
    }
    
    
}
