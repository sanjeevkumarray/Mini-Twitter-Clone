const Post = require("../models/post");
const Comment = require("../models/comment");
module.exports.create = async (req, res) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    req.flash("success", "Post published!");
    return res.redirect("back");
  } catch (error) {
    req.flash("error", "facing some error!");
    console.log("error in creating a post");
    return;
  }
};

module.exports.destroy = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
      await post.deleteOne();
      await Comment.deleteMany({ post: req.params.id });
      req.flash("success", "Post and associated comments deleted!");
      return res.redirect("back");
    } else {
      req.flash("error", "You cannot delete this post!");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", "facing some error!");
    console.error(err);
    return res.redirect("back");
  }
};
