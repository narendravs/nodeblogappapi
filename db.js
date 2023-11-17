import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "blogapp",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("MSQL Server running...");
  //  const rs = db.query("select *from users", (err, data) => {
  //      if (err) return console.log(err)
  //      console.log(data)
  //  });
});
