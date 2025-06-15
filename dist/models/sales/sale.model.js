"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const saleSchema = new mongoose_1.default.Schema({
    date: { type: Date, default: Date.now },
    client: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Client' },
    products: [{
            product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            unitPrice: Number,
            total: Number,
        }],
    totalAmount: Number,
    tva: Number,
    netAmount: Number,
}, { timestamps: true });
exports.default = mongoose_1.default.model('Sale', saleSchema);
