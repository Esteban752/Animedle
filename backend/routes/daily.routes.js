import express from 'express';
import { getDailyAnime, createRandomAnime } from '../controllers/dailyGame.controller.js';


const router = express.Router();


router.get('/', getDailyAnime);

router.post('/:date', getDailyAnime);

router.get('/new', createRandomAnime);

export default router