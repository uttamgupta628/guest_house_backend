import dotenv from "dotenv";
dotenv.config({ path: './.env' });  
import connectDB from "./db/mongodb.js";
import app from "./app.js";

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`server is running on ${process.env.PORT}`);
    });
})
.catch((error)=>{
    console.log("DB connection failed", error);
});
