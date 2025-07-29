import express from 'express'
import type { Application } from 'express';



export const app: Application = express();



//import routes

import userRouter from "./routes/user.route.ts"


app.use("/user", userRouter)