async function auth(req, res, next) {
  const accessToken = req.headers.authorization;
  if (!accesstoken)
    return req.status(401).send({ message: "Access Token not found" });
  try {
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
