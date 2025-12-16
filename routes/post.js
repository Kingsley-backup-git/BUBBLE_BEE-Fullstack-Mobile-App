const express = require("express");
const multer = require("multer");
const app = express()
const requireAuth = require("../middlware")
const { CreatePost, getUserPosts, getAllPosts, toggleLike, getEachPosts } = require("../controllers/posts/posts");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });

const route = express.Router();
app.use(requireAuth)

route.post("/post", upload.single("image"), CreatePost);
route.get("/post", getUserPosts);
route.get("/allPost", getAllPosts);
route.get("/getEachPost/:postId", getEachPosts)
route.post("/post/like/:userId", toggleLike)
