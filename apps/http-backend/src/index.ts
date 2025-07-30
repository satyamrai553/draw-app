import { app } from "./app";
import dotenv from "dotenv"



dotenv.config({
    path: "./env"
})

app.listen(3001, ()=>{
    console.log("App is listening on port: 3001")
    console.log(process.env.JWT_SECRET)
})




