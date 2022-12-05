const express= require("express");
const app=express();
const DB_Connection =require("./db/conn");

const port=process.env.PORT || 4000;
app.get("/",(req , res)=>{

res.send("hello world !!");


});
// app.listen(port,()=>{


//     console.log(`server is running at port no ${port} `);
// });
DB_Connection.on("connected", function () {
    app.listen(4000);
  });
  // Error message handler
  DB_Connection.on("error", function (err) {
    console.log("DB Connection Error: " + err.message);
  });