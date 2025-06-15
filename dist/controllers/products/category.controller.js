"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const category_model_1 = __importDefault(require("../../models/products/category.model"));
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const existing = await category_model_1.default.findOne({ name });
        if (existing)
            res.status(400).json({ message: "Catégorie déjà existante" });
        const category = new category_model_1.default({ name });
        await category.save();
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la création", error });
    }
};
exports.createCategory = createCategory;
const getCategories = async (_req, res) => {
    try {
        const categories = await category_model_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération", error });
    }
};
exports.getCategories = getCategories;
const updateCategory = async (req, res) => {
    try {
        const updated = await category_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated)
            res.status(404).json({ message: "Catégorie non trouvée" });
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", error });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const deleted = await category_model_1.default.findByIdAndDelete(req.params.id);
        if (!deleted)
            res.status(404).json({ message: "Catégorie non trouvée" });
        res.status(200).json({ message: "Catégorie supprimée" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression", error });
    }
};
exports.deleteCategory = deleteCategory;
