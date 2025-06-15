"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const clientSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    phone: String,
    email: String,
    address: String,
}, { timestamps: true });
exports.default = mongoose_1.default.model('Client', clientSchema);
