import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from 'path';
import connectDB from "./config/db";
import productRoutes from "./routes/products/product.route";
import categoryRoutes from "./routes/products/category.route";
import authRoutes from "./routes/auths/auth.route";
import saleRoutes from "./routes/sales/sale.route";
import { verifyToken } from "./middlewares/auth.middleware";


dotenv.config();

const PORT = process.env.PORT || 5000;


const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
app.use("/api/auth", authRoutes);

app.use(verifyToken);

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/sales", saleRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});