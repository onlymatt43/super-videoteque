import { Router } from 'express';
import { createRental, getRentalById } from '../controllers/rental.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createRentalSchema, getRentalSchema } from '../validations/rental.schema.js';

const router = Router();

router.post('/', validateRequest(createRentalSchema), createRental);
router.get('/:id', validateRequest(getRentalSchema), getRentalById);

export { router as rentalRouter };
