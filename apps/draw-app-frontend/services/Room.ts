import { Base_URL } from "@/config";
import axios from "axios";

class RoomService{


    async creatRoom(roomName: string){
      const token = localStorage.getItem("jwtToken"); 
      if(token){
        const parseToken = JSON.parse(token)
        try {
        const resp = await axios.post(
            `${Base_URL}/user/create-room`,
            { name: roomName },
            {
                headers: {
                    Authorization: `${parseToken.token}`,
                },
            }
        );
        console.log("Room created:", resp.data);
        return resp
    } catch (err) {
        console.error("Error creating room:", err);
    }
      }

    
    }

    async getSlug(slug:string):Promise<string>{
         const resp = await axios.get(`${Base_URL}/user/room/${slug}`)
         return  JSON.stringify(resp);
    }
}


const roomService = new RoomService();


export {roomService};