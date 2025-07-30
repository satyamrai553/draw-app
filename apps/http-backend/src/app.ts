import express from 'express'
import type { Application } from 'express';



export const app: Application = express();



//import routes

import userRouter from "./routes/user.route"


app.use("/user", userRouter)