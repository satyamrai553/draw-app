import { Request, Response } from "express"
import jwt  from "jsonwebtoken";
import {CreateUserSchema, SigninSchema, CreatRoomSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/client"
import { JWT_SECRET } from "@repo/backend-common/config";
import bcrypt from "bcrypt"



async function signin(req: Request,res: Response){
    try {
        
        const data = SigninSchema.safeParse(req.body)
    if(!data){
        return res.json({
            status: 401,
            message: "Invalid inputs"
        })
    }


    const username = data.data?.username;
    const password = data.data?.password;
   
    
    const user = await prismaClient.user.findUnique({
    where: { username },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = bcrypt.compare(password || "", user.password)
    if(!isPasswordValid){
        return res.status(401).json({
        success: false,
        message: "Incorrect password",
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
   const password = data.data.password;
   const hashedPassword = await bcrypt.hash(password, 10);
   const username = data.data.username;
   const name = data.data.name;
   


   const newUser = await prismaClient.user.create({
    data: {
        username: username,
        password: hashedPassword,
        name: name,
   }})
   console.log(newUser)


   const userId = newUser.id;
    

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