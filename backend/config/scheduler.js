import cron from 'node-cron';
import { newRandomAnime, insertDailyAnime } from '../services/dailyGame.service.js';

/**
 * génère un nouvel anime random parmi ceux de la database et l'insere dans la table dailyAnime toutes les 24h
 */
export function initializeScheduler() {
    cron.schedule('0 0 * * *', () => {
    let currentAnime = newRandomAnime();
    let currentDate = new Date();
    let dateFormat = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    insertDailyAnime(currentAnime.id,dateFormat);
    }, {
        timezone: "Europe/London"
    });
}
