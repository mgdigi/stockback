import express from 'express';
import { createSale, getSales } from '../../controllers/sales/sale.controller';
import { verifyToken } from '../../middlewares/auth.middleware';

const router = express.Router();

router.post("/", verifyToken, createSale);
router.get("/", verifyToken, getSales);

export default router;
