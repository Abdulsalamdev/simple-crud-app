const jwt = require("jsonwebtoken");
const config = require("../config");
const { User } = require("../models/user");
async function auth(req, res, next) {
  const accessToken = req.headers.authorization;
  if (!accessToken)
    return res.status(401).send({ message: "Access Token not found" });
  try {
    const decodedAccessToken = jwt.verify(accessToken, config.accessToken);
    req.user = {
      id: decodedAccessToken.userId,
    };
    next();
  } catch (error) {
    res.status(401).send({ message: "Access token invalid or expired" });
  }
}
// function authorize(roles = []) {
//   return async (req, res, next) => {
//     const user = await User.findOne({ _id: req.user.id });
//     if (!user || !roles.includes(user.role))
//       return res.status(403).send({ message: "Access Denied" });
//   };
//   next();
// }
module.exports = { auth };
