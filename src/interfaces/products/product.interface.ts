import mongoose from 'mongoose';


export interface IProduct {
  name: string;
  reference?: string;
  category?: mongoose.Schema.Types.ObjectId[];
  quantity: number;
  price: number;
  threshold?: number;
  createdBy: mongoose.Schema.Types.ObjectId;
}