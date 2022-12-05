require("dotenv").config();
const UserSchema = require("../models/registration");
const bycrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
// const SCRET_KEY="NOTESAPI";
const ImageUpload = require(`./ImageUpload/index`);
const e = require("express");

// creation of a new blog
const createUser = (req, res, next) => {
  const upload = ImageUpload.single(`image`);
  upload(req, res, async function (error) {
    if (error) {
      //   return res.render(`Pages/createForm/create`, { errors: error.message });
      return res.status(401).json({ errors: error.message });
    }
    try {
      const { name, email, password } = req.body;

      const password1 = await bycrypt.hash(password, 10);
      const token = jwt.sign(
        { email: createUser.email, id: createUser._id },
        process.env.SECRET_KEY
      );
      console.log(token);
      const create_user = new UserSchema({
        name,
        email,
        password: password1,
        token,
      });

      const blog_sessions = await mongoose.startSession();
      blog_sessions.startTransaction();
      // const token=create_user.generateAuthtoken();
      await create_user.save({ session: blog_sessions });
      await blog_sessions.commitTransaction();
      // return res.status(201).json(true);
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
      });
      return res.redirect("/blog/list");
    } catch (error) {
      return res.status(401).json({ errors: error.message });
    }
  });
};
const logut = async (req, res, next) => {
  // return res.json(`true`);
  try {
    res.clearCookie("jwt");
    console.log("logout successfully");
    return res.redirect("/");
  } catch (error) {
    return res.status(401).json({ errors: error.message });
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usermail = await UserSchema.findOne({ email: email });

    const isMatch = await bycrypt.compare(password, usermail.password);

    if (isMatch) {
      const token = jwt.sign(
        { email: createUser.email, id: createUser._id },
        process.env.SECRET_KEY
      );
      console.log(token);
      console.log("success");
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
      });
      res.redirect("/blog/list");
    } else {
      res.send("password are not matching");
    }
    // console.log(req.file);
  } catch (error) {
    return res.status(401).json({ errors: error.message });
  }
};
exports.createUser = createUser;
exports.login = login;
exports.logut = logut;
