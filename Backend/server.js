let mysql = require("mysql");

let connect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sql-assign",

});

module.exports = connect;