"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./user"));
const error_1 = __importDefault(require("../middlewares/error"));
const post_1 = __importDefault(require("./post"));
// Create an express instance
const app = (0, express_1.default)();
// User router  
app.use('/api/v1/users', user_1.default);
// Post router
app.use('/api/v1/posts', post_1.default);
// Error middleware
app.use(error_1.default);
module.exports = app;
//# sourceMappingURL=index.js.map