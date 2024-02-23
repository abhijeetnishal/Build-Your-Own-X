"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJwt = exports.validatePassword = void 0;
function validatePassword(password) {
    //regex pattern for checking password length is minimum 8 characters which must include uppercase letter, lower case letter, digit and special character
    var pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    //test the password against the pattern
    return pattern.test(password);
}
exports.validatePassword = validatePassword;
function parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(global.atob(base64));
}
exports.parseJwt = parseJwt;
//# sourceMappingURL=commonHelper.js.map