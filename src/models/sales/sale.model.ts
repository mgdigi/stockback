import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    ref: String,
    quantity: Number,
    unitPrice: Number,
    total: Number,
  }],
  totalAmount: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // tva: Number,
  // netAmount: Number,
}, { timestamps: true });

export default mongoose.model('Sale', saleSchema);
