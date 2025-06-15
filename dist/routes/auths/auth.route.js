"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../../controllers/users/user.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post('/register', user_controller_1.register);
router.post('/login', user_controller_1.login);
router.get('/profile', auth_middleware_1.verifyToken, user_controller_1.getProfile);
router.put('/change-password', auth_middleware_1.verifyToken, user_controller_1.changePassword);
router.get('/', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, user_controller_1.getAllUsers);
router.delete('/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, user_controller_1.deleteUser);
router.get('/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdminOrOwner, user_controller_1.getUserById);
router.put('/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdminOrOwner, user_controller_1.updateUser);
exports.default = router;
