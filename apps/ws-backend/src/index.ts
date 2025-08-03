import {WebSocket, WebSocketServer} from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/config"
import {prismaClient} from "@repo/db/client"



const wss = new WebSocketServer({ port: 8080 });



interface User{
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token , JWT_SECRET ?? "");

  if(typeof decoded === "string"){
    return null;
  }

  if (!(decoded as JwtPayload).userId) {
    return null;
  }
  return (decoded as JwtPayload).userId;
  } catch (error) {
    console.log("Token must be wrong: ",error)
    return null;
  }
}

wss.on('connection', function connection(ws, request) {
 const url = request.url;
 if(!url){
  return;
 }
 const queryParams = new URLSearchParams(url.split('?')[1]);
 const token = queryParams.get('token')
 if(!token){
  return
 }
 const userId = checkUser(token);

 if(userId === null){
  ws.close();
  return;
 }

 users.push({
  userId,
  rooms: [],
  ws
 })
 
ws.on('message', async function message(data) {
  console.log(typeof data);

  // Convert Buffer or other non-string types to string
  let dataStr: string;
  if (typeof data !== "string") {
    dataStr = data.toString(); // Fix for Buffer or object type
  } else {
    dataStr = data;
  }

  let parsedData: any;

  try {
    parsedData = JSON.parse(dataStr);
    console.log(parsedData);
  } catch (err) {
    console.error('Invalid JSON received:', dataStr);
    return;
  }

  if (parsedData.type === "join_room") {
    const user = users.find(x => x.ws === ws);
    user?.rooms.push(parsedData.roomId);
  }

  if (parsedData.type === "leave_room") {
    const user = users.find(x => x.ws === ws);
    if (!user) {
      return;
    }
    user.rooms = user.rooms.filter(x => x !== parsedData.roomId); 
  }

  if (parsedData.type === "chat") {
    const roomId = parsedData.roomId;
    const message = parsedData.message;

   const response =  await prismaClient.chat.create({
      data:{
        roomId,
        message,
        userId
      }
    })
    
    users.forEach(user => {
      if (user.rooms.includes(roomId)) {
       user.ws.send(JSON.stringify({
          type: "chat",
          message: message,
          roomId: roomId
        }));
      }
    });
  }
});

  
});

