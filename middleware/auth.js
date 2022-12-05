const jwt = require("jsonwebtoken");
const registration = require("../models/registration");
const Register = require("../models/registration");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      const user = await jwt.verify(token, process.env.SECRET_KEY);
      //  req.userid=user.id
      if (user) {
        console.log(`USER ------------------- `, user);
        // req.user=user;
        next();
      } else {
        return res.status(401).send(error);
      }
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};
module.exports = auth;
