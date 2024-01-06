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
exports.task = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const scheduledPostModel_1 = require("../models/scheduledPostModel");
const postModel_1 = __importDefault(require("../models/postModel"));
// Run every 2 minute
const task = node_cron_1.default.schedule("*/2 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const scheduledPosts = yield scheduledPostModel_1.scheduledPostSchema.find({
        time: { $lte: now.toISOString() },
    });
    if (scheduledPosts.length === 0) {
        task.stop();
    }
    else {
        yield postModel_1.default.insertMany(scheduledPosts);
        yield scheduledPostModel_1.scheduledPostSchema.deleteMany({ time: { $lte: now.toISOString() } });
    }
}), {
    scheduled: false,
});
exports.task = task;
//# sourceMappingURL=cronjobScheduler.js.map