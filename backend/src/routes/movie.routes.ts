import { Router } from 'express';
import { createMovie, getMovieById, listMovies, listFreePreviews, updateMovie } from '../controllers/movie.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createMovieSchema, getMovieSchema, updateMovieSchema } from '../validations/movie.schema.js';

const router = Router();

router.get('/', listMovies);
router.get('/free-previews', listFreePreviews);
router.get('/:id', validateRequest(getMovieSchema), getMovieById);
router.post('/', validateRequest(createMovieSchema), createMovie);
router.patch('/:id', validateRequest(updateMovieSchema), updateMovie);

export { router as movieRouter };
