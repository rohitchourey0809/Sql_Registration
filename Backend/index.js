let db = require("./server");
let express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const salt = 10;




let app = express();
app.use(express.json());
app.use(cors({
  origin:["http://localhost:3000"],
  methods:["POST","GET"],
  credentials: true,
}));
app.use("/uploads", express.static("./uploads"));

app.use(cookieParser());




const storage =  multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"./uploads")
  },
  filename:(req,file,cb)=>{
    console.log("file--------->",file)
    cb(null, `image-${Date.now()}.${file.originalname}`);
    // cb(null,file.filename + "_"+ Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({
  storage : storage,
})

app.post("/upload",upload.single("image"),(req,res)=>{
console.log(req.file)
const image = req.file.filename;
const id = req.body.id;
const sql = "UPDATE login SET image = ? WHERE id = ?"
db.query(sql,[image,id],(err,result)=>{
  if(err) return res.json({Message:"Error"});
  return res.json({Status:"Success"})
})

})

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if(!token) {
    return res.json({Error : "You are not authenticated"})
  }else{
    jwt.verify(token,"jwt-secret-key",(err,decoded)=>{
      if(err){
        return res.json({Error : "Token is not correct"})
      }else{
        req.name = decoded.name;
        next();
      }
    })
  }
};

app.get("/",verifyUser ,(req,res,next)=>{
  console.log("res39",req)
  return res.json({Status:"Success",name:req.name})

})


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

    const sqlQuery = "INSERT INTO login (name, email, password,image) VALUES (?)";
    const values = [req.body.name, req.body.email, req.body.password,"image-1708699082538.Imageprof.png"];

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
      console.log("data--------------->",data)
      if(res){
        const name = data[0].name;
        const token = jwt.sign({name},'jwt-secret-key',{expiresIn : "1d"})
        res.cookie("token",token)
      }
      return res.json("Success");
    } else {
      return res.json("fail");
    }
  });
});

app.get("/userdata",(req,res)=>{
  const sql = "SELECT * FROM login"
  db.query(sql,(err,data)=>{
    if(err) return res.json("Error")
    return res.json(data)
  })
})

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({Status:"Success"})
})


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