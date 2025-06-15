import Sale from '../../models/sales/sale.model';
import Client from '../../models/clients/client.model';
import Product from '../../models/products/product.model';
import { Request, Response } from 'express';

export const createSale = async (req: Request, res: Response) => {
  try {
    
    const { clientInfo, products } = req.body;

    if (!clientInfo || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Données invalides' });
    }

    let client = await Client.findOne({ name: clientInfo.name });
    if (!client) {
      client = new Client(clientInfo);
      await client.save();
    }

    let total = 0;
    const saleItems = [];

    for (const item of products) {
      
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: 'Données produit invalides' });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Produit avec ID ${item.productId} non trouvé` });
      }
      
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour ${product.name}` });
      }

      const totalItem = item.quantity * product.price;
      total += totalItem;

      product.quantity -= item.quantity;
      await product.save();

      saleItems.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice: product.price,
        total: totalItem,
      });
    }

    // const tva = Math.round(total * 0.18);
    // const net = total + tva;

    const newSale = new Sale({
      client: client._id,
      products: saleItems,
      totalAmount: total,
      createdBy: req.user?.id
      // tva,
      // netAmount: net,
    });

    await newSale.save();

    res.status(201).json(newSale);
  } catch (err: any) {
    res.status(500).json({ message: 'Erreur lors de la vente', error: err.message });
  }
};


export const getSales = async (req: Request, res: Response) => {
  try {
    const sales = await Sale.find({createdBy: req.user?.id}).populate('client').populate('products.product');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération ventes' });
  }
};
