"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Create a userSchema
const UserSchema = new mongoose_1.default.Schema({
    // Specify how the fields should work by adding some mongoose option:
    userName: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: false,
    },
    userImage: {
        type: String,
        default: "",
        required: false,
    },
}, { timestamps: true });
// This will create a table or collection if there is no table with that name already.
const userSchema = mongoose_1.default.models.User || mongoose_1.default.model("User", UserSchema);
exports.default = userSchema;
//# sourceMappingURL=userModel.js.map