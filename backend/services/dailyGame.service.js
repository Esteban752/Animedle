import { pool } from '../db/postgres.js';

/**
 * 
 * @param date (YYYY-MM-DD)
 * @returns l'anime du jour de la date entré en parametre
 */
export async function getAnimebyDate(date) {
    // cherche l'id de l'anime dans la table dailyanime
    const idAnime = await pool.query('SELECT animeid FROM dailyanime where date = $1',
        [date]
    );
    // selectionne tout les attributs de l'anime
    const result = await pool.query('SELECT * FROM anime where id = $1',
        [idAnime.rows[0].animeid]
    );
    return result.rows[0];
}

/**
 * 
 * @returns random anime
 */
export async function newRandomAnime() {
    let randId = Math.floor(Math.random() * (Math.floor(828) - Math.ceil(574) + 1) + Math.ceil(574));
    const result = await pool.query('SELECT * FROM anime where id = $1',
        [randId]
    );
    return result.rows[0];
}

/**
 * @description insere dans la table dailyanime un anime et une date
 * @param anime
 * @param date
 */
export async function insertDailyAnime(anime,date) {
    let currentAnime = anime;

    let insertQuery = `
        INSERT INTO dailyanime (
            date,
            animeid
        ) VALUES ($1, $2)
        RETURNING *
    `;

    // ajouter dans la table date la date du jour si elle n'est pas deja présente
    if ((await pool.query(`SELECT * FROM date where date = $1`, [date])).rowCount == 0) {
        await pool.query((`INSERT INTO date (date) VALUES ($1) RETURNING *`), [date]);
    }
    
    // ajouter dans la table dailyanime l'anime et la date du jour si la date n'est pas deja présente
    if ((await pool.query(`SELECT * FROM dailyanime where date = $1`, [date])).rowCount == 0) {
        await pool.query(insertQuery, [
            date,
            currentAnime.id
        ]);
    }

}

