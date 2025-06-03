import dotenv from 'dotenv'
import { app } from './app.js'
dotenv.config()

import connectDB from './config/db.js'
connectDB()


app.listen(process.env.port,()=>{
    console.log("server runnning\t" + process.env.port)
})