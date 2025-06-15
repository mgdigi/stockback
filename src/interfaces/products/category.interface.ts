import mongoose from 'mongoose';


export interface ICategory{
     name: string;
     createdBy: mongoose.Schema.Types.ObjectId;
}