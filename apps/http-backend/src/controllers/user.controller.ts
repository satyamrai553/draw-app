import { Request, Response } from "express"
import jwt  from "jsonwebtoken";
import {CreateUserSchema, SigninSchema, CreatRoomSchema} from "@repo/common/types"
 
const JWT_SECRET = process.env.JWT_SECRET;


async function signin(req: Request,res: Response){
    try {
        const data = SigninSchema.safeParse(req.body)
    if(!data){
        return res.json({
            status: 401,
            message: "Invalid inputs"
        })
    }
    } catch (error) {
      console.log("Error while loging user: ", error)  
    }
}



async function register(req: Request,res: Response){
try {
    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success){
        return res.json({
            status: 401,
            message: "Invalid inputs"
        })
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
    const data = CreatRoomSchema.safeParse(req.body)
    if(!data){
        return res.json({
            status: 401,
            message: "Invalid inputs"
        })
    }
    res.json({
        roomId: "123"
    })
} catch (error) {
    console.log("Error while creating rooom: ", error)
}
}





export {
    signin,
    register,
    createRoom
}