"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../../models/products/product.model"));
function generateProductReference() {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `PRD-${dateStr}-${randomPart}`;
}
const createProduct = async (req, res) => {
    try {
        const { name, price, quantity, threshold, category } = req.body;
        const newProduct = new product_model_1.default({
            name,
            price,
            quantity,
            threshold,
            category,
            reference: generateProductReference()
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    }
    catch (error) {
        console.error("Erreur MongoDB :", error);
        res.status(500).json({ message: "Erreur lors de la création du produit" });
    }
};
exports.createProduct = createProduct;
const getProducts = async (_req, res) => {
    try {
        const products = await product_model_1.default.find().populate('category');
        res.json(products);
    }
    catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération" });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await product_model_1.default.findById(id).populate('category');
        if (!product) {
            res.status(404).json({ message: 'Produit non trouvé' });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await product_model_1.default.findByIdAndUpdate(id, req.body, { new: true }).populate('category');
        if (!updatedProduct) {
            res.status(404).json({ message: 'Produit non trouvé' });
            return;
        }
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await product_model_1.default.findByIdAndDelete(id);
        if (!deletedProduct) {
            res.status(404).json({ message: 'Produit non trouvé' });
            return;
        }
        res.status(200).json({ message: 'Produit supprimé avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};
exports.deleteProduct = deleteProduct;
