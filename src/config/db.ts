// src/config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // ⚠ Toujours appeler ça ici aussi si tu accèdes à process.env ici directement

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB :", error);
    process.exit(1);
  }
};

export default connectDB;
