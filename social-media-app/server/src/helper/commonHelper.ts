function validatePassword(password: string) {
  //regex pattern for checking password length is minimum 8 characters which must include uppercase letter, lower case letter, digit and special character
  var pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  //test the password against the pattern
  return pattern.test(password);
}

function parseJwt(token: string) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

export { validatePassword, parseJwt };
