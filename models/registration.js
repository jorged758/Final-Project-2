const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

const jwt= require("jsonwebtoken");
const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password:{ type: String, required: true },
    token:{type: String, required: true },
    
  });

// UserSchema.methods.generateAuthtoken()=async function()
// {
//     try
//     {
//          console.log(this._id);
//          const token=jwt.sign({_id:this._id});
//          console.log(token);
         
//     }
//     catch (error) {
//       return res.status(401).json({ errors: error.message });
     
//     }
// }


  UserSchema.pre("create_user",async function(next){
      if(this.isModified("pssword"))
      {
        console.log(`this current password is ${this.password}`);
        this.password=await bycrypt.hash(this.password,10);
        console.log(`this current password is ${this.password}`);
      }
      next();

  })
  
   
  module.exports = mongoose.model("user", UserSchema);
  