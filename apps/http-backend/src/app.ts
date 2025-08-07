import express from 'express'
import type { Application } from "express"
import cors  from 'cors';

export const app: Application = express();

app.use(cors({
    origin:"*"
}));
app.use(express.json());



//import routes

import userRouter from "./routes/user.route"


app.use("/user", userRouter)