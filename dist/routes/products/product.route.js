"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../../controllers/products/product.controller");
const router = express_1.default.Router();
router.post("/", product_controller_1.createProduct);
router.get("/", product_controller_1.getProducts);
router.get("/:id", product_controller_1.getProductById);
router.put("/:id", product_controller_1.updateProduct);
router.delete("/:id", product_controller_1.deleteProduct);
exports.default = router;
