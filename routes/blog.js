const express = require("express");

const route = express.Router();

const BlogController = require("../controllers/blog");
const auth = require("../middleware/auth");
const RegistrationController = require("../controllers/registration");

//initializes all crud routes of blog

route.get(`/create_blog_form`, (req, res) => {
  res.render(`Pages/createForm/create`);
});

route.get(`/user_registration`, (req, res) => {
  res.render(`backend/header`);
});
route.get(`/user_login`, (req, res) => {
  res.render(`backend/header1`);
});

route.post(`/user_login`, RegistrationController.login);
route.post(`/user_registration`, RegistrationController.createUser);

route.post(`/create_blog_form`, BlogController.createBlog);

route.get(`/edit_cart_form/:id`, BlogController.GetCartById);
route.patch(`/update_blog_form/:id`, BlogController.updateBlog);

route.post(`/create_cart_form`, BlogController.AddToCart);
route.use(auth);
route.get(`/list`, BlogController.AllBlogs);
route.post(`/update_cart_form/:id`, BlogController.UpdateCart);

route.delete(`/delete_cart_form/:id`, BlogController.deleteCart);

route.get(`/user_logout`, RegistrationController.logut);

module.exports = route;
