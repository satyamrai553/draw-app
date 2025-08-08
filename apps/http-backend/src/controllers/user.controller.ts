import { Request, Response } from "express"
import jwt  from "jsonwebtoken";
import {CreateUserSchema, SigninSchema, CreatRoomSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/client"
import { JWT_SECRET } from "@repo/backend-common/config";
import bcrypt from "bcrypt"



async function login(req: Request,res: Response){
    try {
        
        const data = SigninSchema.safeParse(req.body)
    if(!data.success){
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

    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET ?? "")
    res.status(200).json({
        token
    })

    } catch (error) {
      console.log("Error while loging user: ", error)  
    }
}





async function register(req: Request,res: Response){
try {
    const data = CreateUserSchema.safeParse(req.body);
    console.log(data)
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
    

    
    res.status(200).json({
        userId
    })
} catch (error) {
    console.log("Error while registering user: ", error)
}
}






async function createRoom(req: Request,res: Response){
try {
    const data = CreatRoomSchema.safeParse(req.body)
    if(!data.success){
        return res.json({
            status: 401,
            message: "Invalid inputs"
        })
    }


    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({
            status: 400,
            message: "Missing userId"
        });
    }

    const room = await prismaClient.room.create({
        data: {
            slug: data.data.name,
            adminId: userId
        }
    })
    return res.json({
        roomId: room.id
    })
} catch (error) {
    console.log("Error while creating rooom: ", error)
}
}



async function getChat(req:Request,res: Response){
    try {
        const roomId = Number(req.params.roomId);
        if(!roomId){
            return res.status(404).json({
                message: "Room id not found!"
            })
        }
        const message = await prismaClient.chat.findMany({
            where:{
                roomId: roomId
            },
            orderBy:{
                id: "desc"
            },
            take: 50
        })

        return res.json({
            message
        })
    } catch (error) {
     console.log(Error);   
    }
}

async function  getSlug(req: Request, res: Response) {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where:{
            slug
        }
    });
    res.json({
        room
    })
}


export {
    login,
    register,
    createRoom,
    getChat,
    getSlug
}