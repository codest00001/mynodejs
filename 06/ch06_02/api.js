const express = require("express");
const fs = require("fs");
var moment = require("moment");
const sqlite3 = require("sqlite3");
const path = require("path");

// database setting부분임 
// dao로 빠지는 게 이 부분임. 디비설정이 컨피그로빠짐
const db_name = path.join(__dirname, "post.db");

///데이터베이스 생성
const db = new sqlite3.Database(db_name); 
//


var app = express();
const PORT = 3000;

//app.use에 들어가는 게 미들웨어. 데이터를 주고받을 때 중간에서 도움 주는 것. 미들웨어 사용하겠다.
app.use(express.json());

//
const create_sql = `
    CREATE TABLE if not exists posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        title VARCHAR(255), 
        content TEXT, 
        writer TEXT,
        write_date TEXT,
        count integer default 0
    )`;

    //app.js에 들어갈 내용
db.serialize(() => {
  db.run(create_sql);
});

app.get("/posts", (req, res) => {
  let p = req.query.page;

  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  let sql = `select id, title, content, writer, write_date 
        from posts ORDER BY write_date DESC LIMIT ? OFFSET ? `;

  db.all(sql, [limit, offset], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    } else {
      db.get(`SELECT COUNT(*) as count FROM posts`, (err, row) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
        } else {
          // 이 sql문이 dao로 빠지는 것. 디비와 가장 가깝게 처리하는게 dao로 들어가는 코드.
          const total = row.count;
          //이렇게 토탈을 리미트로 나누듯이
          //받아온 데이터를 처리해주는 게 service코드에서 하는 것. 받아온 데이터를 좀 재가공하는 역할이 서비스에서 함.
          const totalPages = Math.ceil(total / limit);
          res.json({ items: rows, currentPage: page, totalPages });
        }
      });
    }
  });
});

// 컨트롤러는 req로 받아와서 res로 넘기는 역할을 수행. 컨트롤러에서 req, res가 필수.
// 컨트롤러에서 바디, 파람스 등등 받아오는 걸 처리 // 하고 다시 res로 프론트로 넘겨주는 걸 하는 역할.
// req,res성공실패 표시. 컨트롤러에서.

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;

  let sql = `select id, title, content, writer, write_date, count from posts where id = ${id}`;
  console.log(`id => ${id}, sql => ${sql}`);
  let detail = {};
  db.run(`update board set count = count + 1 where id = ${id}`, (err) => {});
  db.all(sql, [], (err, rows) => {
    // 6. run query
    if (err) {
      console.error(err.message);
    }
    // console.log(rows);
    rows.forEach((row) => {
      detail = row;
    });
    console.log(detail);
    res.json({ item: detail }); // 8. render page with data
  });
});

// router에 들어가는 게 이 부분.
//req, res가 컨트롤러에서 받아지는 함수의 기본적인 매개변수가 되는 것. 이것은 고정적인 것.
app.post("/posts", (req, res) => {
  //이 부분은 컨트롤러에서 실행됨
  console.log("/write post", req.body);

  const write_date = moment().format("YYYY-MM-DD");

  //dao로 빠짐. model이라고 부르기도함. 디비를 직접 조작하는 부분.
  let sql = `insert into posts(title, content, writer, write_date) 
        values('${req.body.title}', '${req.body.content}', 'tester', '${write_date}')`;
  db.run(sql, (err) => {
    if (err) {
      console.error(err);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    //res,req는 컨트롤러에서 처리
    res.redirect("/posts");
  });
});

app.put("/posts/:id", (req, res) => {
  const id = req.params.id;

  let sql = `update posts set title = '${req.body.title}', content = '${req.body.content}' where id = ${id}`;
  db.run(sql, (err) => {
    if (err) {
      console.error(err);
    }
    console.log(`A row has been updated with rowid ${this.lastID}`);
    res.redirect("/list");
  });
});

app.delete("/posts/:id", (req, res) => {
  const id = req.params.id;

  let sql = `delete from posts where id = ${id}`;
  db.run(sql, (err) => {
    if (err) {
      console.error(err);
    }
    console.log(`A row has been deleted with rowid ${this.lastID}`);
    res.redirect("/list");
  });
});

//서버키는 것
app.listen(PORT);
console.log("Server is listening on port 3000");
