import express from "express";
import router from "./routes/routes.js";
import cookieParser from "cookie-parser";

const app=express()
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use("/api/v1/users" ,router);
export default app;