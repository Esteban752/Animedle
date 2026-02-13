import express from 'express';
import { AnilistController } from '../controllers/anilist.controller.js'

const anilistController = new AnilistController();

const router = express.Router();
// API AniList
router.get('/import', anilistController.importAnime);
router.get('/', anilistController.getAllAnimes);

export default router