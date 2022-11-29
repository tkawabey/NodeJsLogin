
// expressモジュールを使用する宣言を行います
const express = require("express");
// expressのインスタンスを作成
const app = express();
// リッスンを開始するポート番号
const PORT = 8000;
//　jsonデータでクライアントとデータのやり取りできるように宣言します
app.use(express.json());

// ./routes/auth.jsと、./routes/blog.jsを使用できるように宣言
const auth = require("./routes/auth");
const blog = require("./routes/blog");

// エンドポイント/authの処理は、　auth　で処理するように宣言
app.use("/auth", auth);
// エンドポイント/blogsの処理は、　blog　で処理するように宣言
app.use("/blogs", blog);



app.get("/", (req, res) => {
    res.send("Hello World");
  });
// サーバーを指定したポートでリッスン開始します。
app.listen(PORT, () => {
    console.log("listening on 8000");
} );
