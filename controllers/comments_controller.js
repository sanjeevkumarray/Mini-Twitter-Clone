const Post = require("../models/post");
const Comment = require("../models/comment");
module.exports.create = async (req, res) => {
  try {
    const post = await Post.findById(req.body.post);
    if (post) {
      const comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      post.comments.push(comment);
      await post.save();
      req.flash("success", "Comment published!");
      return res.redirect("/");
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    req.flash("success", "Comment not published!");
    console.log(`error in creating a comment ${error}`);
    return res.redirect("/");
  }
};

module.exports.destroy = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).exec();
    if (comment.user == req.user.id) {
      const postId = comment.post;
      await comment.deleteOne();
      await Post.findByIdAndUpdate(postId, {
        $pull: { comment: req.params.id },
      });
      req.flash("success", "Comment deleted!");
      res.redirect("back");
    } else {
      req.flash("error", "Unauthorized");
      res.redirect("back");
    }
  } catch (err) {
    req.flash("success", "Comment not deleted!");
    console.error(err);
    res.redirect("back");
  }
};
