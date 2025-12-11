import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { movieService } from '../services/movie.service.js';
import { AppError } from '../utils/appError.js';

export const listMovies = async (_req: Request, res: Response) => {
  const movies = await movieService.list();
  res.json({ data: movies });
};

export const getMovieById = async (req: Request, res: Response) => {
  const movie = await movieService.getById(req.params.id);
  if (!movie) {
    throw new AppError('Movie not found', StatusCodes.NOT_FOUND);
  }
  res.json({ data: movie });
};

export const createMovie = async (req: Request, res: Response) => {
  const movie = await movieService.create(req.body);
  res.status(StatusCodes.CREATED).json({ data: movie });
};
