"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Create a follower-following relationship schema
const RelationshipSchema = new mongoose_1.default.Schema({
    // References the follower user's _id from User collection
    followerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    // References the following user's _id from User collection
    followeeId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
}, { timestamps: true });
// This will create a table or collection if there is no table with that name already.
const relationshipSchema = mongoose_1.default.models.Followers || mongoose_1.default.model("Followers", RelationshipSchema);
exports.default = relationshipSchema;
//# sourceMappingURL=relationshipModel.js.map