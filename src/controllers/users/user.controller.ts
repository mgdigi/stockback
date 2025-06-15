import { Request, Response, RequestHandler } from 'express';
// import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/users/user.model';
import { UserPayload } from '../../interfaces/users/user.interface';
import jwt, { Secret } from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { log } from 'console';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/logos/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Seuls les fichiers image sont acceptés'), false);
    }
};

export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 
    }
});


const JWT_SECRET: Secret = process.env.JWT_SECRET as string;


const generateToken = (user: any): string => {
    const payload: UserPayload = {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
        entreprise: user.entreprise
    };
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

export const register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const {nom, prenom, username, password, role, entreprise, adress, telephone } = req.body;
        
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            res.status(400).json({ 
                message: 'Cet nom d\'utilisateur existe déjà' 
            });
            return;
        }

        const logoPath = req.file ? req.file.path : null;

        const newUser = new UserModel({
            nom,
            prenom,
            username,
            password,
            role: role || 'vendeur',
            entreprise,
            logo: logoPath, 
            adress,
            telephone
        });

        await newUser.save();

        const token = generateToken(newUser);

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            token,
            user: {
                id: newUser._id,
                nom: newUser.nom,
                prenom: newUser.prenom,
                username: newUser.username,
                role: newUser.role,
                entreprise: newUser.entreprise,
                logo: newUser.logo, 
                adress: newUser.adress,
                telephone: newUser.telephone
            }
        });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ 
                message: 'Données invalides',
                errors: error.errors 
            });
        } else {
            res.status(500).json({ 
                message: 'Erreur serveur',
                error: error.message 
            });
        }
    }
};

// export const register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    
//     try {
//         const {nom, prenom, username, password, role, entreprise, adress, telephone } = req.body;

//         const existingUser = await UserModel.findOne({ username });
//         if (existingUser) {
//             res.status(400).json({ 
//                 message: 'Cet nom d\'utilisateur existe déjà' 
//             });
//             return;
//         }

//         const newUser = new UserModel({
//             nom,
//             prenom,
//             username,
//             password,
//             role: role || 'vendeur',
//             entreprise,
//             adress,
//             telephone
//         });

//         await newUser.save();

//         const token = generateToken(newUser);

//         res.status(201).json({
//             message: 'Utilisateur créé avec succès',
//             token,
//             user: {
//                 id: newUser._id,
//                 nom: newUser.nom,
//                 prenom: newUser.prenom,
//                 username: newUser.username,
//                 role: newUser.role,
//                 entreprise: newUser.entreprise,
//                 adress: newUser.adress,
//                 telephone: newUser.telephone
//             }
//         });
//     } catch (error: any) {
//         if (error.name === 'ValidationError') {
//             res.status(400).json({ 
//                 message: 'Données invalides', 
//                 errors: error.errors 
//             });
//         } else {
//             res.status(500).json({ 
//                 message: 'Erreur serveur', 
//                 error: error.message 
//             });
//         }
//     }
// };

export const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ 
                message: 'Nom d\'utilisateur et mot de passe requis' 
            });
            return;
        }

        const user = await UserModel.findOne({ username });
        if (!user) {
            res.status(401).json({ 
                message: 'Identifiants invalides' 
            });
            return;
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ 
                message: 'Identifiants invalides' 
            });
            return;
        }

        const token = generateToken(user);

        res.status(200).json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                username: user.username,
                role: user.role,
                entreprise: user.entreprise,
                adress: user.adress,
                telephone: user.telephone,
                logo: user.logo
            }
        });
            console.log(token)

    } catch (error: any) {
        res.status(500).json({ 
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};

export const getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await UserModel.find().select('-password');
        res.status(200).json({
            message: 'Liste des utilisateurs',
            count: users.length,
            users
        });
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};

export const getUserById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id).select('-password');
        
        if (!user) {
            res.status(404).json({ 
                message: 'Utilisateur non trouvé' 
            });
            return;
        }

        res.status(200).json({
            message: 'Utilisateur trouvé',
            user
        });
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};

// Mettre à jour un utilisateur
export const updateUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Ne pas permettre la modification du mot de passe via cette route
        if (updates.password) {
            delete updates.password;
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            id, 
            updates, 
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            res.status(404).json({ 
                message: 'Utilisateur non trouvé' 
            });
            return;
        }

        res.status(200).json({
            message: 'Utilisateur mis à jour avec succès',
            user: updatedUser
        });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ 
                message: 'Données invalides', 
                errors: error.errors 
            });
        } else {
            res.status(500).json({ 
                message: 'Erreur serveur', 
                error: error.message 
            });
        }
    }
};

// Supprimer un utilisateur (Admin uniquement)
export const deleteUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        // Empêcher la suppression de son propre compte
        if (req.user?.id === id) {
            res.status(400).json({ 
                message: 'Vous ne pouvez pas supprimer votre propre compte' 
            });
            return;
        }

        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
            res.status(404).json({ 
                message: 'Utilisateur non trouvé' 
            });
            return;
        }

        res.status(200).json({ 
            message: 'Utilisateur supprimé avec succès' 
        });
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};

// Changer le mot de passe
export const changePassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user?.id;

        if (!currentPassword || !newPassword) {
            res.status(400).json({ 
                message: 'Mot de passe actuel et nouveau mot de passe requis' 
            });
            return;
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ 
                message: 'Utilisateur non trouvé' 
            });
            return;
        }

        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            res.status(400).json({ 
                message: 'Mot de passe actuel incorrect' 
            });
            return;
        }

        // Mettre à jour le mot de passe
        user.password = newPassword;
        await user.save();

        res.status(200).json({ 
            message: 'Mot de passe modifié avec succès' 
        });
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};

// Obtenir le profil de l'utilisateur connecté
export const getProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const user = await UserModel.findById(userId).select('-password');

        if (!user) {
            res.status(404).json({ 
                message: 'Utilisateur non trouvé' 
            });
            return;
        }

        res.status(200).json({
            message: 'Profil utilisateur',
            user
        });
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};