"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledPostSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ScheduledPostSchema = new mongoose_1.default.Schema({
    // Define schema fields based on the ScheduledPost interface
    content: {
        type: String,
        required: true,
        default: "",
    },
    media: {
        type: Object,
        default: {},
    },
    time: {
        type: Date,
        required: true,
        default: new Date(),
    },
    author: {
        type: Object,
        required: true,
        default: {},
    },
}, { timestamps: true });
exports.scheduledPostSchema = mongoose_1.default.models.ScheduledPost ||
    mongoose_1.default.model("ScheduledPost", ScheduledPostSchema);
//# sourceMappingURL=scheduledPostModel.js.map