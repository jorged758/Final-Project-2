const BlogSchema = require("../models/blog");

const mongoose = require("mongoose");

const ImageUpload = require(`./ImageUpload/index`);
// gets all blog posts
const AllBlogs = (req, res) => {
  BlogSchema.find({}, function (err, blogs) {
    const token = req.cookies.jwt;
    res.render("Pages/List/index", { blogs: blogs, token: token });
  });
};
// creation of a new blog
const createBlog = (req, res, next) => {
  const upload = ImageUpload.single(`image`);
  upload(req, res, async function (error) {
    if (error) {
      //   return res.render(`Pages/createForm/create`, { errors: error.message });
      return res.status(401).json({ errors: error.message });
    }
    try {
      const { heading, short_description, long_description } = req.body;
      // console.log(req.file);
      const create_blog = new BlogSchema({
        heading,
        short_description,
        long_description,
        image: req.file.path,
      });
      const blog_sessions = await mongoose.startSession();
      blog_sessions.startTransaction();
      await create_blog.save({ session: blog_sessions });
      await blog_sessions.commitTransaction();
      return res.status(201).json(true);
    } catch (error) {
      return res.status(401).json({ errors: error.message });
    }
  });
};

const AddToCart = async (req, res, next) => {
  try {
    const { name, price, quantity } = req.body;
    // console.log(req.file);
    const total = price * quantity;
    const create_blog = new BlogSchema({
      name,
      price,
      quantity,
      total,
    });
    const blog_sessions = await mongoose.startSession();
    blog_sessions.startTransaction();
    await create_blog.save({ session: blog_sessions });
    await blog_sessions.commitTransaction();
    return res.status(201).json(true);
  } catch (error) {
    return res.status(401).json({ errors: error.message });
  }
};

const UpdateCart = async (req, res, next) => {
  return res.json(req.body);
  try {
    const cartId = req.params.id;
    const { name, price, quantity } = req.body;
    const total = price * quantity;
    BlogSchema.findByIdAndUpdate(
      cartId,
      { quantity: quantity, total: total },
      (error, result) => {
        if (error) {
          return res.status(401).json({ error: error.message });
        } else {
          return res.status(200).json(true);
        }
      }
    );
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

// gets  blog by specific id
const GetCartById = async (req, res, next) => {
  const blogId = req.params.id;
  let blog;
  try {
    blog = await BlogSchema.findById(blogId);
  } catch (err) {
    return res.status(500).json("Could not Blog by id");
  }
  if (!blog) {
    return res.status(404).json("Couldn't Find A Blog For The Specified Id");
  }
  return res.render(`Pages/edit/edit`, { blog: blog });
};
// update the specified blog which will be found in the database wit relevant id
const updateBlog = (req, res, next) => {
  const upload = ImageUpload.single(`image`);
  upload(req, res, async function (error) {
    if (error) {
      return res.status(401).json({ errors: error.message });
    }
    try {
      //   res.json(req.file);
      const blogId = req.params.id;
      let updatedBlog;
      try {
        updatedBlog = await BlogSchema.findById(blogId);
      } catch (err) {
        return res.status(500).json("Could not Blog by id");
      }
      const { heading, short_description, long_description } = req.body;
      const blog_sessions = await mongoose.startSession();
      blog_sessions.startTransaction();
      updatedBlog.heading = heading;
      updatedBlog.short_description = short_description;
      updatedBlog.long_description = long_description;
      if (req.file && req?.file?.path) {
        updatedBlog.image = req.file.path;
      }
      await updatedBlog.save({ session: blog_sessions });
      await blog_sessions.commitTransaction();
      return res.status(201).json(true);
    } catch (error) {
      return res.status(401).json({ errors: error.message });
    }
  });
};
// Deletion of blog of specific id
const deleteCart = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    let deleteBlog;
    try {
      deleteBlog = await BlogSchema.findByIdAndDelete(blogId);
      return res.status(201).json(true);
    } catch (err) {
      return res.status(500).json("Could not find Blog by id" + err);
    }
  } catch (error) {
    return res.status(500).json("Could not find Blog by id" + err);
  }
};

exports.AllBlogs = AllBlogs;
exports.createBlog = createBlog;
exports.GetCartById = GetCartById;

exports.updateBlog = updateBlog;
exports.deleteCart = deleteCart;

exports.AddToCart = AddToCart;
exports.UpdateCart = UpdateCart;
