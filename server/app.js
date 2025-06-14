import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));
app.use(express.static("Public"));
app.use(cookieParser());
app.use(cors());


import userRouter from "./routes/user.router.js";
import roleRouter from './routes/role.router.js'
app.use("/api/v1/users", userRouter)
app.use("/api/v1/roles", roleRouter)


export {app}