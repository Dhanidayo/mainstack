const jwt = require("jsonwebtoken");
const { USER_MODEL } = require("../db/models");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET_PASS);

    req.user = await USER_MODEL.findOne({ _id }).select("_id");

    if (!req.user) {
      return res
        .status(401)
        .json({
          error: "Unrecognized user. Please register/login to continue.",
        });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
