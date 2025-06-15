import mongoose, { Schema, model } from "mongoose";
import { ICategory } from "../../interfaces/products/category.interface";

const categoryShema = new Schema (
    {
        name : {
            type: String,  require : true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
        
    },
        { timestamps: true }

)

const CategoryModel = mongoose.model<ICategory>("Category", categoryShema);
export default CategoryModel;