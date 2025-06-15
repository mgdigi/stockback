"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sale_controller_1 = require("../../controllers/sales/sale.controller");
const router = express_1.default.Router();
router.post("/", sale_controller_1.createSale);
router.get("/", sale_controller_1.getSales);
exports.default = router;
