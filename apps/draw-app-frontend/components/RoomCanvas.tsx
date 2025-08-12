"use client"
import Canvas from "./Canvas";
import { WS_URL } from "@/config";
import { useEffect, useRef, useState } from "react"

export default function RoomCanvas({roomId}: {roomId: string }){
    
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [jwtToken, setJwtToken] = useState<{ token: string } | null>(null);

    useEffect(() => {
        const tokenStr = localStorage.getItem("jwtToken");
        if (tokenStr) {
            try {
                const parsed = JSON.parse(tokenStr);
                setJwtToken(parsed);
            } catch {
                console.error("Invalid token format in localStorage");
            }
        }
    }, []);

   
    useEffect(() => {
        if (!jwtToken?.token) return;

        const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(jwtToken.token)}`);

        ws.onopen = () => {
            setSocket(ws);
            ws.send(
                JSON.stringify({
                    type: "join_room",
                    roomId,
                })
            );
        };

        return () => {
            ws.close();
        };
    }, [jwtToken, roomId]);


    

    if(!socket){
        return <div className="text-black">
            Connecting to server...
        </div>
    }

    return <div>
       <Canvas roomId={roomId} socket={socket}/>
            </div>
}