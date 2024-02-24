"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = __importDefault(require("./infra/mongodb"));
// Configure env
dotenv_1.default.config();
// Create an express instance
const app = (0, express_1.default)();
// To parse the incoming requests with JSON we are using express.json() which is a built-in middleware function in Express.
app.use(express_1.default.json());
// Define port
const port = process.env.port || 8080;
// Check environment
const isProduction = process.env.NODE_ENV === "production";
// CORS Configuration
const corsOptions = {
    origin: isProduction ? [process.env.CLIENT_URL] : "*",
};
// This will allow the user in the frontend to consume the APIs that you have created without any problem.
app.use((0, cors_1.default)(corsOptions));
// Disable X-Powered-By Header
app.disable("x-powered-by");
app.set("trust proxy", true);
// Execute database connection
(0, mongodb_1.default)();
// Get request when server is live
app.get("/", (req, res) => {
    res.status(200).json("Server is Live");
});
// All API endpoints
app.use(require("./routes/index"));
// Listen the server
app.listen(port, () => {
    console.log("Server listening at port " + port);
});
//# sourceMappingURL=index.js.map