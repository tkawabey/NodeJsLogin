// ルータを使用するように宣言します。
const router = require("express").Router();
 
const { privateBlogs } = require("../db/Blog");
const checkAuth = require("../middleware/checkAuth");

router.get("/private", checkAuth, (req, res) => {
    res.json(privateBlogs);
  });

// 他JSからでも使用できるようにExportsします。
module.exports = router;
