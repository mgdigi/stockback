import { Request, Response, RequestHandler } from "express";
import CategoryModel from '../../models/products/category.model';

export const createCategory: RequestHandler = async (req : Request, res : Response):Promise<void> => {
  try {
    const { name } = req.body;
    const existing = await CategoryModel.findOne({ name });
    if (existing)  res.status(400).json({ message: "Catégorie déjà existante" });

    const category = new CategoryModel({ 
      name,
      createdBy: req.user?.id 
     });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création", error });
  }
};

export const getCategories  = async (_req: Request, res : Response):Promise<void> => {
  try {
    const userId = _req.user?.id;
    const categories = await CategoryModel.find({createdBy: userId}).sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error });
  }
};

export const updateCategory: RequestHandler = async (req : Request, res : Response):Promise<void> => {
  try {
    const updated = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated)  res.status(404).json({ message: "Catégorie non trouvée" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error });
  }
};

export const deleteCategory: RequestHandler = async (req : Request, res : Response): Promise<void> => {
  try {
    const deleted = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!deleted) res.status(404).json({ message: "Catégorie non trouvée" });
    res.status(200).json({ message: "Catégorie supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};
