"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSales = exports.createSale = void 0;
const sale_model_1 = __importDefault(require("../../models/sales/sale.model"));
const client_model_1 = __importDefault(require("../../models/clients/client.model"));
const product_model_1 = __importDefault(require("../../models/products/product.model"));
const createSale = async (req, res) => {
    try {
        const { clientInfo, products } = req.body;
        let client = await client_model_1.default.findOne({ name: clientInfo.name });
        if (!client) {
            client = new client_model_1.default(clientInfo);
            await client.save();
        }
        let total = 0;
        const saleItems = [];
        for (const item of products) {
            const product = await product_model_1.default.findById(item.productId);
            if (!product || product.quantity < item.quantity) {
                return res.status(400).json({ message: `Stock insuffisant pour ${product?.name}` });
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
        const tva = Math.round(total * 0.18);
        const net = total + tva;
        const newSale = new sale_model_1.default({
            client: client._id,
            products: saleItems,
            totalAmount: total,
            tva,
            netAmount: net,
        });
        await newSale.save();
        res.status(201).json(newSale);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la vente' });
    }
};
exports.createSale = createSale;
const getSales = async (req, res) => {
    try {
        const sales = await sale_model_1.default.find().populate('client').populate('products.product');
        res.json(sales);
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur récupération ventes' });
    }
};
exports.getSales = getSales;
