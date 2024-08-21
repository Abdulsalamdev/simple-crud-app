const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { ACCESS_TOKEN } = process.env;
async function auth(req, res, next) {
  const accessToken = req.headers.authorization;
  if (!accessToken)
    return res.status(401).send({ message: "Access Token not found" });
  try {
    const decodedAccessToken = jwt.verify(accessToken, ACCESS_TOKEN);
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
