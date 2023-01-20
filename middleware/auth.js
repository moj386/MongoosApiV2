const jwt = require("jsonwebtoken");
const TokenKey = require('./secret_key');
const secret_key_value = TokenKey.key;

const verifyToken = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, secret_key_value);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;

function extractToken (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}