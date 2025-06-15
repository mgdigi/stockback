import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from 'path';


dotenv.config();

import connectDB from "./src/config/db";
import productRoutes from "./src/routes/products/product.route";
import categoryRoutes from "./src/routes/products/category.route";
import authRoutes from "./src/routes/auths/auth.route";
import saleRoutes from "./src/routes/sales/sale.route";



const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, './uploads')));


app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sales", saleRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});