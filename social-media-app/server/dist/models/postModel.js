"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const authorSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: mongoose_1.default.Types.ObjectId,
    },
    name: {
        type: String,
        default: "",
        required: true,
    },
});
// Create a postSchema
const PostSchema = new mongoose_1.default.Schema({
    // Specify how the fields should work by adding some mongoose option:
    content: {
        type: String,
        default: "",
        required: true,
    },
    mediaUrl: {
        type: Object,
        default: {},
    },
    author: {
        type: authorSchema,
        default: {},
        required: true,
    },
}, { timestamps: true });
// This will create a table or collection if there is no table with that name already.
const postSchema = mongoose_1.default.models.Post || mongoose_1.default.model("Post", PostSchema);
exports.default = postSchema;
//# sourceMappingURL=postModel.js.map