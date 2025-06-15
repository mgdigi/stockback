"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/db.ts
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // ⚠ Toujours appeler ça ici aussi si tu accèdes à process.env ici directement
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
    }
    catch (error) {
        console.error("❌ Erreur de connexion MongoDB :", error);
        process.exit(1);
    }
};
exports.default = connectDB;
