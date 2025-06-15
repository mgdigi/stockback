import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../../interfaces/users/user.interface';

export interface IUserDocument extends IUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    nom : {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true,
        minlength: [2, 'Le nom doit contenir au moins 2 caractères']
    },
    prenom: {
        type: String,
        required: [true, 'Le prénom est requis'],
        trim: true,
        minlength: [2, 'Le prénom doit contenir au moins 2 caractères']
    },
    username: {
        type: String,
        required: [true, 'Le nom d\'utilisateur est requis'],
        unique: true,
        trim: true,
        minlength: [3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères']
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
    },
    role: {
        type: String,
        enum: ['Admin', 'vendeur'],
        required: [true, 'Le rôle est requis'],
        default: 'vendeur'
    },
    entreprise: {
        type: String,
        required: [true, 'Le nom de l\'entreprise est requis'],
        trim: true
    },
    adress: {
        type: String,
        required: [true, 'L\'adresse est requise'],
        trim: true
    },
    telephone: {
        type: Number,
        required: [true, 'Le numéro de téléphone est requis'],
        validate: {
            validator: function(v: number) {
                return /^[0-9]{9,15}$/.test(v.toString());
            },
            message: 'Le numéro de téléphone doit contenir entre 9 et 15 chiffres'
        }
    },
    logo: {
        type: String,
        required: false,
        trim: true
    }
}, {
    timestamps: true
});

UserSchema.pre<IUserDocument>('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);