const cloudinary = require("../../config/cloudinary");
const Post = require("../../models/post");

async function CreatePost(req, res) {
  const { caption } = req.body;
  const { _id } = req.user;
  const image = req.file;

  if (!id) {
    return res.status(401).json({ message: "User id not found" });
  }
  if (!image && !caption) {
    return res.status(400).json({ message: "Bad Request" });
  }

  try {
    const result = await cloudinary.uploader.upload(image.path, {
      upload_preset: "ml_default",
    });

    const newPost = new Post({
      user: _id,
      ...(caption !== "" && { caption }),
      imageUrl: result.secure_url,
    });
    res.status(200).json({
      data: newPost,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server error" });
  }
}

async function getUserPosts(req, res) {
  const { _id } = req.user;
  try {
    if (!_id) {
      return res.status(401).json({ message: "User not found" });
    }
    const posts = await Post.find({ user: _id });

    return res.status(200).json({ data: posts });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error" });
  }
}

async function getEachPosts(req, res) {
  const { postId } = req.params;
  try {
    if (!postId) {
      return res.status(401).json({ message: "Bad request" });
    }
    const posts = await Post.find({ _id: postId }).populate({
      path: "comments",
      populate: { path: "user", select: "email" },
    });

    return res.status(200).json({ data: posts });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error" });
  }
}

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find({});

    return res.status(200).json({ data: posts });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error" });
  }
}

async function toggleLike(req, res) {
  const { userId } = req.params;
  const { postId } = req.body;
  try {
    if (!userId || !postId) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const posts = await Post.findOne({ _id: postId });
    const hasLiked = posts.likes.includes(userId);

    if (hasLiked) {
      await Post.findOneAndUpdate(
        { _id: postId },
        {
          $pull: { likes: userId },
        }
      );
    } else {
      await Post.findOneAndUpdate(
        { _id: postId },
        {
          $addToSet: { likes: userId },
        }
      );
    }
    return res.status(200).json({ data: "Successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server error" });
  }
}

module.exports = {
  CreatePost,
  getUserPosts,
  toggleLike,
  getAllPosts,
  getEachPosts
};
