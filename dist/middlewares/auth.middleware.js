"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminOrOwner = exports.isVendeur = exports.isAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_here";
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(403).json({ message: "Token manquant" });
        return;
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: "Token invalide" });
            return;
        }
        req.user = decoded;
        next();
    });
};
exports.verifyToken = verifyToken;
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "Admin") {
        res.status(403).json({
            message: "Accès réservé aux administrateurs"
        });
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
const isVendeur = (req, res, next) => {
    if (!req.user || req.user.role !== "vendeur") {
        res.status(403).json({
            message: "Accès réservé aux vendeurs"
        });
        return;
    }
    next();
};
exports.isVendeur = isVendeur;
const isAdminOrOwner = (req, res, next) => {
    const { id } = req.params;
    if (req.user?.role === "Admin" || req.user?.id === id) {
        next();
    }
    else {
        res.status(403).json({
            message: "Accès non autorisé"
        });
        return;
    }
};
exports.isAdminOrOwner = isAdminOrOwner;
