// ルータを使用するように宣言します。
const router = require("express").Router();
const { User } = require("../db/User");
// emailやpasswordのバリデーションチェックのため、express-validator
// モジュールを使用するよう宣言します。
const { body, validationResult } = require("express-validator");
// bcryptモジュールを使用するように宣言します
const bcrypt = require("bcrypt");
//jsonwebtokenモジュールを使用するように宣言します
const JWT = require("jsonwebtoken");
// 他JSからでも使用できるようにExportsします。
module.exports = router;

router.get("/allUsers", (req, res) => {
    return res.json(User);
  });

// ユーザー新規登録。
// エンドポイント( /auth/register) にポストメソッドのパラメータが来た場合の処理を実装します
router.post(
  "/register",
  // emailの妥当性をチェックします。
  body("email").isEmail(),
  // パスワードの最小文字数６以上であるかをチェックします
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    // 
    const { email, password } = req.body;

    //入力欄のバリデーションチェック。
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //DBにユーザーが存在するかのチェック。存在したらエラーを吐かせる。
    const user = User.find((user) => user.email === email);
    if (user) {
      return res.status(400).json([
        {
          msg: "すでにそのユーザーは存在します。",
        },
      ]);
    }
     //パスワードのハッシュ化(ランダムな文字列。復号するのは非常に困難)
     let hashedPassword = await bcrypt.hash(password, 10);
     // console.log(hashedPassword);

     // DBにユーザーを登録します。（仮）
     User.push({
       email,
       password: hashedPassword,
     }); 

    //トークンを発行します。
    const token = await JWT.sign(
        {
          email,
        },
        "SECRET_KEY",
        { expiresIn: 60 }
      );
    console.log(email, password);

    // クライアントに生成したトークンを返信します。
    return res.json({
        token: token,
      }); 
});

// ログインの処理を実装
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    const user = User.find((user) => user.email === email);
  
    if (!user) {
      return res.status(400).json([
        {
          msg: "そのユーザーは存在しません",
        },
      ]);
    }
    //パスワードが一致しているかチェックします
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json([
        {
          msg: "パスワードが違います",
        },
      ]);
    }

    
    //トークンを発行します。
    const token = await JWT.sign(
        {
          email,
        },
        "SECRET_KEY",
        { expiresIn: 60 }
      );
    
    //クライアントに生成したトークンを返信します。
      return res.json({
        token: token,
      });


  });
  
 
// 他JSからでも使用できるようにExportsします。
module.exports = router;
