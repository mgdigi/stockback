import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from '../interfaces/users/user.interface';

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_here";

export const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
        res.status(403).json({ message: "Token manquant" });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, decoded) => {
        if (err) {
            res.status(403).json({ message: "Token invalide" });
            return;
        }
        
        req.user = decoded as UserPayload;
        next();
    });
};




export const isAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== "Admin") {
        res.status(403).json({ 
            message: "Accès réservé aux administrateurs" 
        });
        return;
    }
    next();
};

export const isVendeur: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== "vendeur") {
        res.status(403).json({ 
            message: "Accès réservé aux vendeurs" 
        });
        return;
    }
    next();
};

export const isAdminOrOwner: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const { id } = req.params;
    
    if (req.user?.role === "Admin" || req.user?.id === id) {
        next();
    } else {
        res.status(403).json({ 
            message: "Accès non autorisé" 
        });
        return;
    }
};