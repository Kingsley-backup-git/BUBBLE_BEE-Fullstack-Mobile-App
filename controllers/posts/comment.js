const Post = require("../../models/post");
const Comment = require("../../models/comments");

async function AddComment(req, res) {
  const { userId } = req.params;
  const { postId, text } = req.body;

  try {
    if (!userId || !postId || !text) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const newComment = new Comment({
      user: userId,
      post: postId,
      text,
    });

    const post = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $addToSet: {
          comments: newComment._id,
        },
      }
    );
    await post.save();
    await newComment.save();
    return res.status(200).json({ message: newComment });
  } catch (err) {
      console.log(err)
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getComments(req, res) {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ post: postId }).populate("user", "email");

    return res.status(200).json({ message: comments });
  } catch (err) {
      console.log(err)
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
    AddComment,
    getComments
};
