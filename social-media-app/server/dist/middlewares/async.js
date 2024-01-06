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
Object.defineProperty(exports, "__esModule", { value: true });
// This asyncMiddleware function wraps your handler(function) and provides error handling logic, making your code cleaner and more maintainable.
function asyncMiddleware(handler) {
    // asyncMiddleware returns another anonymous async function
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield handler(req, res, next);
        }
        catch (error) {
            if (next) {
                next(error);
            }
            else {
                res.status(500).json({ error: error.message });
            }
        }
    });
}
exports.default = asyncMiddleware;
//# sourceMappingURL=async.js.map