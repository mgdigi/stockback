import express from "express";

import { 
    createCategory,
     getCategories,
     updateCategory,
     deleteCategory,
 } from "../../controllers/products/category.controller";
 import { verifyToken } from "../../middlewares/auth.middleware";

 const router = express.Router();

 router.post("/", verifyToken, createCategory);
 router.get("/", verifyToken, getCategories);
 router.put("/:id", updateCategory);
 router.delete("/:id", deleteCategory);

 export default router;