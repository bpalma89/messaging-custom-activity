const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 5432,
});

client.connect(function (err) {
  if (!err) {
    console.log("Connected!");
  } else {
    console.log(ererr.messager);
  }
});

client.query("SELECT * FROM configparameter", (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err.message);
  }
});
