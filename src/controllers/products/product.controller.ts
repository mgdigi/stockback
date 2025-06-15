import { Request, Response, RequestHandler } from "express";
import ProductModel from "../../models/products/product.model";
import { ref } from "process";


function generateProductReference(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `PRD-${dateStr}-${randomPart}`;
}


export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new ProductModel({
      ...req.body,
      createdBy: req.user?.id,
      reference: generateProductReference(),
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du produit" });
  }
};


export const getProducts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const products = await ProductModel.find({createdBy : userId}).populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération" });
  }
};

export const getProductById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id).populate('category');
    
    if (!product) {
      res.status(404).json({ message: 'Produit non trouvé' });
      return;
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

export const updateProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, { new: true }).populate('category');
    
    if (!updatedProduct) {
      res.status(404).json({ message: 'Produit non trouvé' });
      return;
    }
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

export const deleteProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      res.status(404).json({ message: 'Produit non trouvé' });
      return;
    }
    
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

