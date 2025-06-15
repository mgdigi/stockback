import mongoose, { Schema, model } from "mongoose";
import {IProduct} from "../../interfaces/products/product.interface"

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    reference: { type: String, required: false,  unique: true },
    category: {
        type : mongoose.Schema.Types.ObjectId,
            ref : 'Category',
       },
    quantity: { type: Number, default: 0 },
    price: { type: Number, required: true },
    threshold: { type: Number, default: 5 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    
  },
  { timestamps: true }
);

const ProductModel = mongoose.model<IProduct>("Product", productSchema);
export default ProductModel;