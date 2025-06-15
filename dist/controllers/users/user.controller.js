"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.changePassword = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.login = exports.register = void 0;
// import jwt from 'jsonwebtoken';
const user_model_1 = require("../../models/users/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const generateToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username,
        role: user.role,
        entreprise: user.entreprise
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};
// S'inscrire
const register = async (req, res) => {
    try {
        const { username, password, role, entreprise, adress, telephone } = req.body;
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await user_model_1.UserModel.findOne({ username });
        if (existingUser) {
            res.status(400).json({
                message: 'Cet nom d\'utilisateur existe déjà'
            });
            return;
        }
        // Créer nouvel utilisateur
        const newUser = new user_model_1.UserModel({
            username,
            password,
            role: role || 'vendeur',
            entreprise,
            adress,
            telephone
        });
        await newUser.save();
        // Générer token
        const token = generateToken(newUser);
        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role,
                entreprise: newUser.entreprise,
                adress: newUser.adress,
                telephone: newUser.telephone
            }
        });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                message: 'Données invalides',
                errors: error.errors
            });
        }
        else {
            res.status(500).json({
                message: 'Erreur serveur',
                error: error.message
            });
        }
    }
};
exports.register = register;
// Se connecter
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Validation des champs
        if (!username || !password) {
            res.status(400).json({
                message: 'Nom d\'utilisateur et mot de passe requis'
            });
            return;
        }
        // Chercher l'utilisateur
        const user = await user_model_1.UserModel.findOne({ username });
        if (!user) {
            res.status(401).json({
                message: 'Identifiants invalides'
            });
            return;
        }
        // Vérifier le mot de passe
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                message: 'Identifiants invalides'
            });
            return;
        }
        // Générer token
        const token = generateToken(user);
        res.status(200).json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                entreprise: user.entreprise,
                adress: user.adress,
                telephone: user.telephone
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};
exports.login = login;
// Obtenir tous les utilisateurs (Admin uniquement)
const getAllUsers = async (req, res) => {
    try {
        const users = await user_model_1.UserModel.find().select('-password');
        res.status(200).json({
            message: 'Liste des utilisateurs',
            count: users.length,
            users
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};
exports.getAllUsers = getAllUsers;
// Obtenir un utilisateur par ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await user_model_1.UserModel.findById(id).select('-password');
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
    }
    catch (error) {
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};
exports.getUserById = getUserById;
// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        // Ne pas permettre la modification du mot de passe via cette route
        if (updates.password) {
            delete updates.password;
        }
        const updatedUser = await user_model_1.UserModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password');
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
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                message: 'Données invalides',
                errors: error.errors
            });
        }
        else {
            res.status(500).json({
                message: 'Erreur serveur',
                error: error.message
            });
        }
    }
};
exports.updateUser = updateUser;
// Supprimer un utilisateur (Admin uniquement)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Empêcher la suppression de son propre compte
        if (req.user?.id === id) {
            res.status(400).json({
                message: 'Vous ne pouvez pas supprimer votre propre compte'
            });
            return;
        }
        const deletedUser = await user_model_1.UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
            return;
        }
        res.status(200).json({
            message: 'Utilisateur supprimé avec succès'
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};
exports.deleteUser = deleteUser;
// Changer le mot de passe
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user?.id;
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                message: 'Mot de passe actuel et nouveau mot de passe requis'
            });
            return;
        }
        const user = await user_model_1.UserModel.findById(userId);
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
    }
    catch (error) {
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};
exports.changePassword = changePassword;
// Obtenir le profil de l'utilisateur connecté
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await user_model_1.UserModel.findById(userId).select('-password');
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
    }
    catch (error) {
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};
exports.getProfile = getProfile;
