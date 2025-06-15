import express  from 'express';
import {
    register,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    changePassword,
    getProfile
} from '../../controllers/users/user.controller';
import { verifyToken, isAdmin, isAdminOrOwner } from '../../middlewares/auth.middleware';
import {upload} from '../../controllers/users/user.controller'

const router = express.Router();

router.post('/register', upload.single('logo'), register);
router.post('/login',upload.single('logo'), login);

router.get('/profile', verifyToken, getProfile);
router.put('/change-password', verifyToken, changePassword);

router.get('/', verifyToken, isAdmin, getAllUsers);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

router.get('/:id', verifyToken, isAdminOrOwner, getUserById);
router.put('/:id', verifyToken, isAdminOrOwner, updateUser);

export default router;