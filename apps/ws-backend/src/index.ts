import {WebSocket, WebSocketServer} from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/config"
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
 
ws.on('message', function message(data){
if(typeof data !== "string"){
  return;
} 
const parsedData = JSON.parse(data)
  if(parsedData.type === "join_room"){
    const user = users.find(x => x.ws === ws)
    user?.rooms.push(parsedData.roomId); 
  }


  if(parsedData.type ==="leave_room"){
    const user = users.find(x=> x.ws === ws)
    if(!user){
      return;
    }
    user.rooms =user?.rooms.filter(x => x ===parsedData.room)
  }

  if(parsedData.type === "chat"){
    const roomId = parsedData.roomId;
    const message = parsedData.message
    users.forEach((user=>{
      if(user.rooms.includes(roomId)){
        user.ws.send(JSON.stringify({
          type: "chat",
          message: message,
          roomId
        }))
      }
    }))
  }
})
  
});

