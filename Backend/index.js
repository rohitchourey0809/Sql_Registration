let db = require("./server");
let express = require("express");
let app = express();
const cors = require("cors");





app.use(express.json());
app.use(cors());


app.post("/signup", function (req, res) {
  const checkEmail = "SELECT * FROM login WHERE email = ?";
  const emailValues = [req.body.email];

  db.query(checkEmail, emailValues, (err, data) => {
    if (err) {
      return res.json("Error checking email");
    }

    if (data.length > 0) {
      return res.status(400).json({msg:"Email already exists"});
    }

    const sqlQuery = "INSERT INTO login (name, email, password) VALUES (?)";
    const values = [req.body.name, req.body.email, req.body.password];

    db.query(sqlQuery, [values], (err, data) => {
      if (err) {
        return res.status(500).json("Error in signup");
      }
      res.json({data: data ,
      message:"User created Successfully"
      });
    });
  });
});


app.post("/login", function (req, res) {
  const sql = "SELECT * FROM login  WHERE email = ? AND  password = ?";
  const values = [req.body.email, req.body.password];
  console.log(values);
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json(err);
    }
    if (data.length > 0) {
      return res.json("Success");
    } else {
      return res.json("fail");
    }
  });
});

db.connect(function (error) {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("database connect");
    }
  });

  app.listen(5000, () => {
    console.log("listening 5000");
  });