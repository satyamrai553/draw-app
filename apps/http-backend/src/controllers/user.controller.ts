import { Request, Response } from "express"
import jwt  from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET;



async function login(req: Request,res: Response){
    try {
        
    } catch (error) {
      console.log("Error while loging user: ", error)  
    }
}



async function register(req: Request,res: Response){
try {
    const {email, password} = req.body;
    if([email,password].some((data)=>data.trim() === "")){
        res.status(401).json({
            message: "Email or password is required"
        })
        return;
    }
    //db call 
    const userId = 1

    const token = jwt.sign({
        userId
    }, JWT_SECRET ?? "")
    res.status(200).json({
        token
    })
} catch (error) {
    console.log("Error while registering user: ", error)
}
}






async function createRoom(req: Request,res: Response){
try {
    res.json({
        roomId: "123"
    })
} catch (error) {
    console.log("Error while creating rooom: ", error)
}
}





export {
    login,
    register,
    createRoom
}