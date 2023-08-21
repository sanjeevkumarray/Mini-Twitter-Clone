const Post = require("../models/post");
const User = require("../models/user");
module.exports.home = home = async (req, res) => {
  try {
    const username = req.user ? req.user.name : "Twitter";
    const post = await Post.find({})
      .populate("user")
      .populate({ path: "comments", populate: { path: "user" } })
      .exec();

    const users = await User.find({}).exec();

    res.render("home", {
      title: `${username} | Home`,
      posts: post,
      all_users: users,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
};
