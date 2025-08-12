"use client"
import Canvas from "./Canvas";
import { WS_URL } from "@/config";
import { useEffect, useRef, useState } from "react"

export default function RoomCanvas({roomId}: {roomId: string}){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const token = localStorage.getItem("token")

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token${token}`)
        ws.onopen = () =>{
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }
    },[])

    

    if(!socket){
        return <div className="text-black">
            Connecting to server...
        </div>
    }

    return <div>
       <Canvas roomId={roomId} socket={socket}/>
            </div>
}