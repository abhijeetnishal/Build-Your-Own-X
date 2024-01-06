"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Configure env
dotenv_1.default.config();
// Create and export a function to house the connection:
function dbConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        // Use mongoose to connect this application to our database using the MONGO_URI (connection string)
        mongoose_1.default.set('strictQuery', true);
        mongoose_1.default.connect(process.env.MONGO_URI, {
            // These are options to ensure that the connection is done properly
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            // Use a then catch block to show if the connection was successful or not:
            .then(() => {
            console.log("Successfully connected to MongoDB Atlas!");
        })
            .catch((error) => {
            console.log("Unable to connect to MongoDB Atlas!");
            console.error(error);
        });
    });
}
exports.default = dbConnect;
//# sourceMappingURL=index.js.map