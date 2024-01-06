"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This function handles errors thrown during middleware or route execution. 
// It extracts relevant information, formats it into a standardized ErrorMiddleware object, and sends it back as a JSON response. 
function errorMiddleware(err, req, res, next) {
    const errStatus = err.statusCode || 400;
    let error = {
        success: false,
        code: 0,
        data: {},
        message: "",
    };
    error.success = err.success || false;
    error.code = errStatus;
    error.data = err.data || {};
    // The message and stack trace are only included in development mode.
    if (process.env.NODE_ENV === "development" && error.success === false) {
        error.stack = err.stack || {};
    }
    if (err.message) {
        error.message = err.message || "Something went wrong";
    }
    res.status(200).json(error);
}
exports.default = errorMiddleware;
//# sourceMappingURL=error.js.map