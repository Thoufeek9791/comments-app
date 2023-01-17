const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const mySql = require("mysql");
const app = express();
const port = 5000;

//we are disabling the form encoded format
app.use(express.urlencoded({ extended: false }));
//we are calling json and the data is sent and received in json format
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "assets")));
//method override
app.use(methodOverride("_method"));

//MySql connection
const pool = mySql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "user",
});

function getRows(resolve, reject) {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    else {
      console.log(`Connected as ID: ${connection.threadId}`);

      connection.query("select * from comments", (err, rows) => {
        connection.release(); //return the construction to the pool

        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    }
  });
}

//List of All comments
app.get("/comments", (req, res) => {
  let promise = new Promise(getRows)
    .then((result) => {
      console.log(result);
      res.render("comments", { result });
    })
    .catch((err) => {
      res.render(err);
    });
});

//TO get a particular row based on the id
// app.get("comments/:id", (req, res) => {
//   pool.getConnection((err, connect) => {
//     if (err) throw err;
//     else {
//       console.log(`Connected as Id: ${connect.threadId}`);
//       // const { id } = req.params;
//       connect.query(
//         `select * from comments where id = ?`,
//         [req.params.id],
//         (err, rows) => {
//           if (!err) {
//             res.send(rows);
//           } else {
//             console.log(err);
//           }
//         }
//       );
//     }
//   });
// });

app.delete("/comments/delete/:id", (req, res) => {
  pool.getConnection((err, connect) => {
    if (err) throw err;
    else {
      console.log(`connected as ID ${connect.threadId}`);
      connect.query(
        "delete from comments where id = ?",
        [req.params.id],
        (err, rows) => {
          if (err) throw err;
          else {
            res.redirect("/comments");
          }
        }
      );
    }
  });
});

//Edit Comment
app.patch("/comments/edit/:id", (req, res) => {
  pool.getConnection((err, connect) => {
    if (err) throw err;
    else {
      console.log(`connected as ID ${connect.threadId}`);
      connect.query(
        `UPDATE comments SET comments='${req.body.newComment}' WHERE id = ?`,
        [req.params.id],
        (err, rows) => {
          if (err) throw err;
          else {
            res.redirect("/comments");
          }
        }
      );
    }
  });
  console.log(req.body);
});

//create New Comment
app.get("/comments/newComment", (req, res) => {
  res.render("newComment");
});

app.post("/comments/newComment", (req, res) => {
  pool.getConnection((err, connect) => {
    if (err) throw err;
    else {
      console.log(`connected as ID ${connect.threadId}`);
      connect.query(
        `INSERT INTO comments (name, comments, email)
        VALUES ('${req.body.userName}', '${req.body.comment}', '${req.body.mailId}');
        `,
        (err, rows) => {
          if (err) throw err;
          else {
            res.redirect("/comments");
          }
        }
      );
    }
  });
});

app.get("/", (req, res) => res.send("Hello World! from Mysql"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
