export interface IUser {
    nom: string;
    prenom: string;
    username: string;
    password: string;
    role: "Admin" | "vendeur";
    entreprise: string;
    adress: string;
    telephone: number;
    logo?: string;
}

export interface UserPayload {
    id: string;
    username: string;
    role: "Admin" | "vendeur";
    entreprise: string;
    iat?: number;
    exp?: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}