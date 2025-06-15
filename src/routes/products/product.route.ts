import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../../controllers/products/product.controller";
import {verifyToken} from "../../middlewares/auth.middleware";

const router = express.Router(); 

router.post("/",verifyToken, createProduct);
router.get("/", verifyToken,  getProducts);
router.get("/:id", verifyToken, getProductById);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
