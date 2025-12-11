import { Router } from 'express';
import { createMovie, getMovieById, listMovies } from '../controllers/movie.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createMovieSchema, getMovieSchema } from '../validations/movie.schema.js';

const router = Router();

router.get('/', listMovies);
router.get('/:id', validateRequest(getMovieSchema), getMovieById);
router.post('/', validateRequest(createMovieSchema), createMovie);

export { router as movieRouter };
