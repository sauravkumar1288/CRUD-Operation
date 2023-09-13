const express = require("express"); //express package initiated
const app = express(); // express instance has been created and will be access by app variable
const cors = require("cors");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
const connection = require("./config/db.js");

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.get("/", (req, res) => {
  res.redirect("/create.html");
});

//read
app.get("/data", (req, res) => {
  const allData = "select * from demo123";
  connection.query(allData, (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      // res.json({ rows });
      res.render("read.ejs", { rows });
    }
  });
});

//create
app.post("/create", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  try {
    connection.query(
      "INSERT into demo123 (name,email) values(?,?)",
      [name, email],
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          // res.json({ result });
          res.redirect("/data");
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
});

//delete
app.get("/delete-data", (req, res) => {
  const deleteData = "delete from demo123 where id=?";
  connection.query(deleteData, [req.query.id], (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/data");
    }
  });
});

//final update
app.post("/update", (req, res) => {
    const id_data = req.body.hidden_id;
    const name_data = req.body.name;
    const email_data = req.body.email;
  
    console.log("id...", req.body.name, id_data);
  
    const updateQuery = "update demo123 set name=?, email=? where id=?";
  
    connection.query(
      updateQuery,
      [name_data, email_data, id_data],
      (err, rows) => {
        if (err) {
          res.send(err);
        } else {
          res.redirect("/data");
        }
      }
    );
  });

app.listen(process.env.PORT || 4000, function (err) {
  if (err) console.log(err);
  console.log(`listening to port ${process.env.PORT}`);
});